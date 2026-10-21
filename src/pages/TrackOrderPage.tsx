import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import OryginStar from '../components/OryginStar';
import Scene3D from '../components/Scene3D';
import Reveal3D from '../components/Reveal3D';

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  tracking_status: string | null;
  carrier: string | null;
  tracking_number: string | null;
  customer_name: string;
  customer_email: string;
  created_at: string;
  items: Array<{ product_name: string; size: string; quantity: number; unit_price: number }>;
  total: number;
  shipping_address: { street: string; city: string; postal_code: string; country: string };
}

const TRACKING_URLS: Record<string, (num: string) => string> = {
  'Chronopost': (n) => `https://www.chronopost.fr/fr/suivi?numero=${n}`,
  'Colissimo': (n) => `https://www.colissimo.fr/track/colissimo_${n}`,
  'DHL': (n) => `https://www.dhl.com/fr/fr/home/tracking/tracking-express.html?submit=1&tracking-id=${n}`,
  'UPS': (n) => `https://www.ups.com/track?tracknum=${n}`,
  'FedEx': (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}`,
  'La Poste': (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${n}`,
};

const STATUS_STEPS = [
  { key: 'preparation', label: 'Préparation', icon: Package, color: '#f59e0b' },
  { key: 'shipped', label: 'Expédiée', icon: Truck, color: '#60a5fa' },
  { key: 'delivered', label: 'Livrée', icon: CheckCircle, color: '#34d399' },
];

const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: '#f59e0b' },
  paid: { label: 'Payée', color: '#c9a84c' },
  shipped: { label: 'Expédiée', color: '#60a5fa' },
  delivered: { label: 'Livrée', color: '#34d399' },
  cancelled: { label: 'Annulée', color: '#ef4444' },
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orderNumber.trim() || !email.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    const { data, error: queryErr } = await supabase
      .from('orders')
      .select('id, order_number, status, tracking_status, carrier, tracking_number, customer_name, customer_email, created_at, items, total, shipping_address')
      .eq('order_number', orderNumber.trim().toUpperCase())
      .eq('customer_email', email.trim().toLowerCase())
      .maybeSingle();

    setLoading(false);

    if (queryErr) {
      setError('Erreur de recherche. Réessayez.');
      return;
    }
    if (!data) {
      setError('Aucune commande trouvée avec ces informations.');
      return;
    }
    setOrder(data as OrderData);
  };

  const trackingStatus = order?.tracking_status ?? 'preparation';
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === trackingStatus);
  const trackingUrl = order?.carrier && order?.tracking_number
    ? (TRACKING_URLS[order.carrier]?.(order.tracking_number) ?? null)
    : null;

  return (
    <div className="min-h-screen bg-black-1 pt-16 page3d-in" style={{ background: 'radial-gradient(ellipse at top, #0d0a04 0%, #080808 60%)' }}>
      <Scene3D count={20} className="opacity-30" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <OryginStar size={22} />
          <h1 className="font-cormorant italic text-3xl text-white">Suivre ma commande</h1>
        </div>

        <Link to="/" className="flex items-center gap-2 text-[9px] tracking-[3px] text-gray-2 hover:text-gold transition-colors mb-12">
          <ArrowLeft size={12} />RETOUR BOUTIQUE
        </Link>

        {/* Search form */}
        {!order && (
          <Reveal3D>
            <form onSubmit={handleSearch} className="space-y-5 mb-8">
              <div>
                <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">NUMÉRO DE COMMANDE</label>
                <input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
                  placeholder="ORY-XXXXXX"
                  className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">EMAIL DE COMMANDE</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors" />
              </div>

              {error && <p className="text-[10px] tracking-[2px] text-red-400">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-4 text-[9px] tracking-[5px] flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)', color: '#080808' }}>
                {loading ? (
                  <><div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />RECHERCHE...</>
                ) : (
                  <><Search size={13} />SUIVRE MA COMMANDE</>
                )}
              </button>
            </form>
          </Reveal3D>
        )}

        {/* Order result */}
        {order && (
          <div className="space-y-8">
            {/* Order info */}
            <div className="border border-black-3 p-6" style={{ background: 'rgba(13,13,13,0.6)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[8px] tracking-[4px] text-gold-dark mb-1">COMMANDE</p>
                  <p className="font-cormorant italic text-xl text-white">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] tracking-[3px] text-gray-2 mb-1">STATUT PAIEMENT</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: (ORDER_STATUS_LABELS[order.status] ?? { color: '#888' }).color }} />
                    <span className="text-[9px] tracking-[2px]"
                      style={{ color: (ORDER_STATUS_LABELS[order.status] ?? { color: '#888' }).color }}>
                      {(ORDER_STATUS_LABELS[order.status] ?? { label: order.status }).label}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] tracking-[2px] text-gray-3">
                {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Tracking steps */}
            <div className="border border-black-3 p-8" style={{ background: 'rgba(13,13,13,0.6)' }}>
              <p className="text-[9px] tracking-[5px] text-gold-dark mb-8">SUIVI DE LIVRAISON</p>

              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-black-3" />
                <div
                  className="absolute left-5 top-0 w-px bg-gradient-to-b from-gold to-gold-dark transition-all duration-700"
                  style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                {STATUS_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isDone = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="relative flex items-center gap-5 pb-8 last:pb-0">
                      <div
                        className="relative z-10 w-10 h-10 flex items-center justify-center border transition-all duration-500"
                        style={{
                          background: isDone ? 'rgba(201,168,76,0.1)' : '#0d0d0d',
                          borderColor: isDone ? step.color : '#2a2a2a',
                          color: isDone ? step.color : '#555',
                          boxShadow: isCurrent ? `0 0 20px ${step.color}40` : 'none',
                        }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-cormorant italic text-base transition-colors duration-300"
                          style={{ color: isDone ? '#fff' : '#555' }}>
                          {step.label}
                        </p>
                        {isCurrent && i === 2 && (
                          <p className="text-[9px] tracking-[2px] text-gray-2 mt-0.5">Votre colis a été livré</p>
                        )}
                        {isCurrent && i === 1 && order.tracking_number && (
                          <p className="text-[9px] tracking-[2px] text-gray-2 mt-0.5">En cours d'acheminement</p>
                        )}
                        {isCurrent && i === 0 && (
                          <p className="text-[9px] tracking-[2px] text-gray-2 mt-0.5">Votre commande est en préparation</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carrier info + tracking link */}
              {order.carrier && order.tracking_number && (
                <div className="mt-6 pt-6 border-t border-black-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] tracking-[4px] text-gold-dark mb-1">TRANSPORTEUR</p>
                      <p className="text-sm text-white">{order.carrier}</p>
                      <p className="text-[10px] tracking-[2px] text-gray-2 mt-1">N° {order.tracking_number}</p>
                    </div>
                    {trackingUrl && (
                      <a href={trackingUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[9px] tracking-[4px] text-gold border border-gold-dark/40 px-5 py-3 hover:bg-gold-dark/10 transition-colors">
                        SUIVRE LE COLIS<ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Items summary */}
            <div className="border border-black-3 p-6" style={{ background: 'rgba(13,13,13,0.6)' }}>
              <p className="text-[9px] tracking-[4px] text-gold-dark mb-5">ARTICLES</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-black-3/60 last:border-0">
                    <div>
                      <span className="font-cormorant italic text-sm text-white">{item.product_name}</span>
                      <span className="text-[9px] tracking-[2px] text-gray-2 ml-3">{item.size} · ×{item.quantity}</span>
                    </div>
                    <span className="font-cormorant italic text-gold text-sm">{item.unit_price * item.quantity} €</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-black-3">
                <span className="text-[9px] tracking-[4px] text-white">TOTAL</span>
                <span className="font-cormorant italic text-2xl"
                  style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {Math.round(order.total / 100)} €
                </span>
              </div>
            </div>

            {/* Shipping address */}
            <div className="border border-black-3 p-6" style={{ background: 'rgba(13,13,13,0.4)' }}>
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-4">LIVRAISON À</p>
              <p className="text-sm text-gray-3 leading-relaxed">
                {order.customer_name}<br />
                {order.shipping_address.street}<br />
                {order.shipping_address.postal_code} {order.shipping_address.city}<br />
                {order.shipping_address.country}
              </p>
            </div>

            <button onClick={() => { setOrder(null); setOrderNumber(''); setEmail(''); }}
              className="flex items-center gap-2 text-[9px] tracking[3px] text-gray-2 hover:text-gold transition-colors mx-auto">
              <Search size={12} />SUIVRE UNE AUTRE COMMANDE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
