import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, User, MapPin, ChevronRight, Edit3, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import OryginStar from '../components/OryginStar';

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  items: Array<{ product_name: string; country_name: string; size: string; quantity: number; unit_price: number }>;
  total: number;
  shipping_address: { city: string; country: string };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: '#f59e0b' },
  paid: { label: 'Payée', color: '#c9a84c' },
  shipped: { label: 'Expédiée', color: '#60a5fa' },
  delivered: { label: 'Livrée', color: '#34d399' },
  cancelled: { label: 'Annulée', color: '#ef4444' },
};

export default function AccountPage() {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: '', phone: '', address: '', city: '', postal_code: '', country: 'France',
  });

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'France',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('id, order_number, status, created_at, items, total, shipping_address')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    await updateProfile(form);
    setSaveLoading(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex items-center justify-center">
        <OryginStar size={40} className="animate-pulse-star opacity-40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-1 pt-16" style={{ background: 'radial-gradient(ellipse at top, #0d0a04 0%, #080808 60%)' }}>
      {/* Top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div
              className="w-16 h-16 flex items-center justify-center font-cormorant italic text-2xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                border: '0.5px solid rgba(201,168,76,0.3)',
                color: '#c9a84c',
                boxShadow: '0 0 30px rgba(201,168,76,0.08)',
              }}
            >
              {profile.avatar_initials}
            </div>
            <div>
              <p className="text-[8px] tracking-[5px] text-gold-dark mb-1">MON COMPTE</p>
              <h1 className="font-cormorant italic text-3xl text-white leading-tight">
                {profile.full_name || 'Bienvenue'}
              </h1>
              <p className="text-[10px] tracking-[2px] text-gray-3 mt-0.5">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[8px] tracking-[3px] text-gray-2 hover:text-white transition-colors border border-black-3 px-4 py-2.5 hover:border-gray-2"
          >
            <LogOut size={12} />
            DÉCONNEXION
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black-3 mb-10">
          {([
            { key: 'orders', label: 'MES COMMANDES', icon: <Package size={12} /> },
            { key: 'profile', label: 'MON PROFIL', icon: <User size={12} /> },
          ] as const).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-4 text-[9px] tracking-[4px] border-b transition-all duration-300 ${
                activeTab === key
                  ? 'text-gold border-gold-dark'
                  : 'text-gray-2 border-transparent hover:text-white'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24">
                <OryginStar size={48} className="mx-auto mb-6 opacity-20 animate-float" />
                <p className="font-cormorant italic text-2xl text-gray-3 mb-2">Aucune commande</p>
                <p className="text-[9px] tracking-[4px] text-gray-2 mb-8">VOS ACHATS APPARAÎTRONT ICI</p>
                <Link
                  to="/"
                  className="inline-block px-8 py-3.5 text-[9px] tracking-[5px]"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0, #c9a84c)', color: '#080808' }}
                >
                  EXPLORER LA BOUTIQUE
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const st = STATUS_LABELS[order.status] ?? { label: order.status, color: '#888' };
                  return (
                    <Link
                      key={order.id}
                      to={`/confirmation/${order.order_number}`}
                      className="block border border-black-3 hover:border-gold-dark/30 transition-all duration-300 group"
                      style={{ background: 'rgba(13,13,13,0.6)' }}
                    >
                      <div className="px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-[8px] tracking-[4px] text-gold-dark mb-1">COMMANDE</p>
                            <p className="font-cormorant italic text-lg text-white">{order.order_number}</p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">DATE</p>
                            <p className="text-sm text-gray-3">
                              {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">ARTICLES</p>
                            <p className="text-sm text-gray-3">{order.items.length} pièce{order.items.length > 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">STATUT</p>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                              <span className="text-[9px] tracking-[2px]" style={{ color: st.color }}>{st.label}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className="font-cormorant italic text-2xl"
                            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                          >
                            {Math.round(order.total / 100)} €
                          </span>
                          <ChevronRight size={14} className="text-gray-2 group-hover:text-gold transition-colors" />
                        </div>
                      </div>

                      {/* Item previews */}
                      <div className="px-6 pb-5 border-t border-black-3 pt-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-[8px] tracking-[2px] text-gray-2 bg-black-3 px-3 py-1">
                              {item.product_name} · {item.size}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-[8px] tracking-[2px] text-gray-2 bg-black-3 px-3 py-1">
                              +{order.items.length - 3} de plus
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] tracking-[5px] text-gold-dark">INFORMATIONS PERSONNELLES</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-[8px] tracking-[3px] text-gray-2 hover:text-gold transition-colors"
                >
                  <Edit3 size={11} />
                  MODIFIER
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="text-[8px] tracking-[3px] text-gray-2 hover:text-white transition-colors"
                >
                  ANNULER
                </button>
              )}
            </div>

            <div className="space-y-5">
              {[
                { label: 'NOM COMPLET', field: 'full_name' as const, placeholder: 'Anas Ezzine' },
                { label: 'TÉLÉPHONE', field: 'phone' as const, placeholder: '+33 6 00 00 00 00' },
              ].map(({ label, field, placeholder }) => (
                <ProfileField
                  key={field}
                  label={label}
                  value={form[field]}
                  onChange={v => setForm(p => ({ ...p, [field]: v }))}
                  editing={editing}
                  placeholder={placeholder}
                />
              ))}

              <div className="pt-5 border-t border-black-3">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={12} className="text-gold-dark" />
                  <span className="text-[9px] tracking-[4px] text-gold-dark">ADRESSE DE LIVRAISON</span>
                </div>
                {[
                  { label: 'ADRESSE', field: 'address' as const, placeholder: '12 rue de la Paix' },
                  { label: 'VILLE', field: 'city' as const, placeholder: 'Paris' },
                  { label: 'CODE POSTAL', field: 'postal_code' as const, placeholder: '75001' },
                  { label: 'PAYS', field: 'country' as const, placeholder: 'France' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} className="mb-4">
                    <ProfileField
                      label={label}
                      value={form[field]}
                      onChange={v => setForm(p => ({ ...p, [field]: v }))}
                      editing={editing}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>

              {/* Email (read-only) */}
              <div className="pt-4 border-t border-black-3">
                <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">EMAIL</label>
                <p className="text-sm text-gray-3 py-3.5 px-4 border border-black-3 bg-black-3/30 cursor-not-allowed">{profile.email}</p>
              </div>
            </div>

            {editing && (
              <button
                onClick={handleSaveProfile}
                disabled={saveLoading}
                className="mt-8 w-full py-4 text-[9px] tracking-[5px] flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
                  color: '#080808',
                  boxShadow: '0 0 40px rgba(201,168,76,0.15)',
                }}
              >
                {saveLoading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />SAUVEGARDE...</>
                ) : (
                  <><Check size={13} />SAUVEGARDER LES MODIFICATIONS</>
                )}
              </button>
            )}

            {saved && (
              <div className="mt-4 flex items-center gap-2 text-[9px] tracking-[3px] text-gold justify-center">
                <Check size={12} />
                Modifications sauvegardées
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value, onChange, editing, placeholder }: {
  label: string; value: string;
  onChange: (v: string) => void;
  editing: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">{label}</label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 hover:border-gray-2 transition-colors"
        />
      ) : (
        <p className={`text-sm py-3.5 px-4 border border-black-3 ${value ? 'text-white' : 'text-gray-2 italic'}`}
          style={{ background: 'rgba(13,13,13,0.4)' }}>
          {value || `— ${placeholder ?? ''}`}
        </p>
      )}
    </div>
  );
}
