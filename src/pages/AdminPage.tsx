import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Star, Check, X, Truck, CheckCircle, Clock, ExternalLink, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import OryginStar from '../components/OryginStar';
import Scene3D from '../components/Scene3D';

interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  tracking_status: string | null;
  carrier: string | null;
  tracking_number: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  created_at: string;
  items: Array<{ product_name: string; country_name: string; size: string; quantity: number; unit_price: number }>;
  total: number;
  shipping_address: { street: string; city: string; postal_code: string; country: string };
}

interface AdminReview {
  id: string;
  product_id: string;
  product_name: string;
  rating: number;
  name: string;
  email: string;
  comment: string;
  status: string;
  created_at: string;
}

const CARRIERS = ['Chronopost', 'Colissimo', 'DHL', 'UPS', 'FedEx', 'La Poste'];

const STATUS_FLOW = [
  { key: 'preparation', label: 'Préparation', icon: Clock, color: '#f59e0b' },
  { key: 'shipped', label: 'Expédiée', icon: Truck, color: '#60a5fa' },
  { key: 'delivered', label: 'Livrée', icon: CheckCircle, color: '#34d399' },
];

export default function AdminPage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'orders' | 'reviews'>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ carrier: '', trackingNumber: '', trackingStatus: 'preparation' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  const loadOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_status, carrier, tracking_number, customer_name, customer_email, customer_phone, created_at, items, total, shipping_address')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
  }, []);

  const loadReviews = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('id, product_id, product_name, rating, name, email, comment, status, created_at')
      .order('created_at', { ascending: false });
    setReviews(data ?? []);
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([loadOrders(), loadReviews()]).then(() => setDataLoading(false));
  }, [user, loadOrders, loadReviews]);

  const startEdit = (order: AdminOrder) => {
    setEditingOrder(order.id);
    setEditForm({
      carrier: order.carrier ?? '',
      trackingNumber: order.tracking_number ?? '',
      trackingStatus: order.tracking_status ?? 'preparation',
    });
  };

  const handleSaveOrder = async (orderId: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('orders')
      .update({
        carrier: editForm.carrier || null,
        tracking_number: editForm.trackingNumber || null,
        tracking_status: editForm.trackingStatus,
      })
      .eq('id', orderId);

    setSaving(false);
    if (error) {
      setSaveMsg('Erreur lors de la sauvegarde.');
    } else {
      setSaveMsg('Commande mise à jour.');
      setEditingOrder(null);
      await loadOrders();
    }
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleReviewAction = async (reviewId: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase.from('reviews').update({ status: action }).eq('id', reviewId);
    if (!error) await loadReviews();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex items-center justify-center">
        <OryginStar size={40} className="animate-pulse-star opacity-40" />
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-black-1 pt-16 page3d-in" style={{ background: 'radial-gradient(ellipse at top, #0d0a04 0%, #080808 60%)' }}>
      <Scene3D count={15} className="opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))', border: '0.5px solid rgba(201,168,76,0.3)' }}>
              <OryginStar size={24} />
            </div>
            <div>
              <p className="text-[8px] tracking-[5px] text-gold-dark mb-1">ESPACE ADMIN</p>
              <h1 className="font-cormorant italic text-3xl text-white">Tableau de bord</h1>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 text-[8px] tracking-[3px] text-gray-2 hover:text-white transition-colors border border-black-3 px-4 py-2.5 hover:border-gray-2">
            <LogOut size={12} />DÉCONNEXION
          </button>
        </div>

        {saveMsg && (
          <div className="mb-6 px-4 py-3 border text-[10px] tracking-[3px]"
            style={{ borderColor: saveMsg.includes('Erreur') ? 'rgba(239,68,68,0.4)' : 'rgba(201,168,76,0.4)', color: saveMsg.includes('Erreur') ? '#ef4444' : '#c9a84c' }}>
            {saveMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-black-3 mb-10">
          <button onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-6 py-4 text-[9px] tracking-[4px] border-b transition-all duration-300 ${tab === 'orders' ? 'text-gold border-gold-dark' : 'text-gray-2 border-transparent hover:text-white'}`}>
            <Package size={12} />COMMANDES
            <span className="text-[7px] text-gray-2 ml-1">{orders.length}</span>
          </button>
          <button onClick={() => setTab('reviews')}
            className={`flex items-center gap-2 px-6 py-4 text-[9px] tracking-[4px] border-b transition-all duration-300 ${tab === 'reviews' ? 'text-gold border-gold-dark' : 'text-gray-2 border-transparent hover:text-white'}`}>
            <Star size={12} />AVIS
            {pendingReviews.length > 0 && (
              <span className="ml-1 w-4 h-4 bg-gold text-black-1 text-[8px] rounded-full flex items-center justify-center">{pendingReviews.length}</span>
            )}
          </button>
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            {dataLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-center text-[10px] tracking-[4px] text-gray-2 py-20">AUCUNE COMMANDE</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const ts = order.tracking_status ?? 'preparation';
                  const statusInfo = STATUS_FLOW.find(s => s.key === ts) ?? STATUS_FLOW[0];
                  const isEditing = editingOrder === order.id;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={order.id} className="border border-black-3" style={{ background: 'rgba(13,13,13,0.6)' }}>
                      {/* Order header */}
                      <div className="px-6 py-5 border-b border-black-3 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <p className="text-[8px] tracking-[4px] text-gold-dark mb-1">COMMANDE</p>
                            <p className="font-cormorant italic text-lg text-white">{order.order_number}</p>
                          </div>
                          <div>
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">CLIENT</p>
                            <p className="text-sm text-gray-3">{order.customer_name}</p>
                            <p className="text-[9px] tracking-[1px] text-gray-2">{order.customer_email}</p>
                          </div>
                          <div>
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">DATE</p>
                            <p className="text-sm text-gray-3">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">TOTAL</p>
                            <p className="font-cormorant italic text-lg" style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                              {Math.round(order.total / 100)} €
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">SUIVI</p>
                            <div className="flex items-center gap-1.5">
                              <StatusIcon size={12} style={{ color: statusInfo.color }} />
                              <span className="text-[9px] tracking-[2px]" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => isEditing ? setEditingOrder(null) : startEdit(order)}
                          className="text-[9px] tracking-[3px] text-gold border border-gold-dark/40 px-5 py-2.5 hover:bg-gold-dark/10 transition-colors">
                          {isEditing ? 'FERMER' : 'MODIFIER'}
                        </button>
                      </div>

                      {/* Items + address */}
                      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[8px] tracking-[3px] text-gray-2 mb-3">ARTICLES</p>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="text-[10px] tracking[1px] text-gray-3 flex justify-between">
                                <span>{item.product_name} · {item.size} · ×{item.quantity}</span>
                                <span className="text-gold">{item.unit_price * item.quantity} €</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] tracking-[3px] text-gray-2 mb-3">LIVRAISON</p>
                          <p className="text-[10px] text-gray-3 leading-relaxed">
                            {order.shipping_address.street}<br />
                            {order.shipping_address.postal_code} {order.shipping_address.city}<br />
                            {order.shipping_address.country}
                          </p>
                          {order.customer_phone && <p className="text-[9px] tracking-[1px] text-gray-2 mt-2">Tél: {order.customer_phone}</p>}
                        </div>
                      </div>

                      {/* Edit panel */}
                      {isEditing && (
                        <div className="px-6 py-5 border-t border-black-3 space-y-5" style={{ background: 'rgba(201,168,76,0.03)' }}>
                          <p className="text-[9px] tracking-[5px] text-gold-dark">MODIFIER LE SUIVI</p>

                          {/* Status selector */}
                          <div>
                            <label className="block text-[8px] tracking-[4px] text-gold-dark mb-3">STATUT</label>
                            <div className="flex gap-3">
                              {STATUS_FLOW.map(s => {
                                const Icon = s.icon;
                                return (
                                  <button key={s.key} type="button"
                                    onClick={() => setEditForm(f => ({ ...f, trackingStatus: s.key }))}
                                    className={`flex items-center gap-2 px-5 py-3 text-[9px] tracking-[3px] border transition-all duration-200 ${editForm.trackingStatus === s.key ? 'border-gold text-gold' : 'border-black-3 text-gray-2 hover:border-gray-2'}`}
                                    style={editForm.trackingStatus === s.key ? { background: 'rgba(201,168,76,0.08)' } : {}}>
                                    <Icon size={12} />{s.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Carrier + tracking number */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">TRANSPORTEUR</label>
                              <select value={editForm.carrier} onChange={e => setEditForm(f => ({ ...f, carrier: e.target.value }))}
                                className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white outline-none focus:border-gold-dark/50 transition-colors">
                                <option value="">— Sélectionner —</option>
                                {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">N° DE SUIVI</label>
                              <input type="text" value={editForm.trackingNumber} onChange={e => setEditForm(f => ({ ...f, trackingNumber: e.target.value }))}
                                placeholder="Ex: CD123456789FR"
                                className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors" />
                            </div>
                          </div>

                          <button onClick={() => handleSaveOrder(order.id)} disabled={saving}
                            className="px-8 py-3.5 text-[9px] tracking-[5px] flex items-center gap-3 transition-all duration-300 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)', color: '#080808' }}>
                            {saving ? (
                              <><div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />SAUVEGARDE...</>
                            ) : (
                              <><Check size={13} />ENREGISTRER</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reviews tab */}
        {tab === 'reviews' && (
          <div>
            {dataLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Pending */}
                {pendingReviews.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <Clock size={14} className="text-gold-dark" />
                      <span className="text-[9px] tracking-[5px] text-gold-dark">EN ATTENTE DE MODÉRATION ({pendingReviews.length})</span>
                    </div>
                    <div className="space-y-4">
                      {pendingReviews.map(review => (
                        <ReviewCard key={review.id} review={review} onAction={handleReviewAction} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved */}
                {approvedReviews.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <Check size={14} className="text-green-400" />
                      <span className="text-[9px] tracking-[5px] text-gray-2">PUBLIÉS ({approvedReviews.length})</span>
                    </div>
                    <div className="space-y-4">
                      {approvedReviews.map(review => (
                        <ReviewCard key={review.id} review={review} onAction={handleReviewAction} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {rejectedReviews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <X size={14} className="text-red-400" />
                      <span className="text-[9px] tracking-[5px] text-gray-2">REJETÉS ({rejectedReviews.length})</span>
                    </div>
                    <div className="space-y-4 opacity-60">
                      {rejectedReviews.map(review => (
                        <ReviewCard key={review.id} review={review} onAction={handleReviewAction} />
                      ))}
                    </div>
                  </div>
                )}

                {reviews.length === 0 && (
                  <p className="text-center text-[10px] tracking-[4px] text-gray-2 py-20">AUCUN AVIS</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, onAction }: { review: AdminReview; onAction: (id: string, action: 'approved' | 'rejected') => void }) {
  return (
    <div className="border border-black-3 p-6" style={{ background: 'rgba(13,13,13,0.5)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={12} className={n <= review.rating ? 'text-gold fill-gold' : 'text-gray-2'} />
              ))}
            </div>
            <span className="font-cormorant italic text-sm text-white">{review.name}</span>
            <span className="text-[8px] tracking-[2px] text-gray-2">{review.email}</span>
          </div>
          <p className="text-[9px] tracking-[2px] text-gold-dark mb-2">{review.product_name}</p>
        </div>
        <span className="text-[8px] tracking-[2px] text-gray-2">
          {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
      <p className="text-sm text-gray-3 leading-relaxed italic mb-4">"{review.comment}"</p>
      {review.status === 'pending' && (
        <div className="flex gap-3">
          <button onClick={() => onAction(review.id, 'approved')}
            className="flex items-center gap-2 text-[9px] tracking-[3px] text-green-400 border border-green-900/40 px-4 py-2.5 hover:bg-green-950/20 transition-colors">
            <Check size={11} />APPROUVER
          </button>
          <button onClick={() => onAction(review.id, 'rejected')}
            className="flex items-center gap-2 text-[9px] tracking-[3px] text-red-400 border border-red-900/40 px-4 py-2.5 hover:bg-red-950/20 transition-colors">
            <X size={11} />REJETER
          </button>
        </div>
      )}
    </div>
  );
}
