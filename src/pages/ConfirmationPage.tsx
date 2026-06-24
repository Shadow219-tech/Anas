import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import OryginStar from '../components/OryginStar';

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  shipping_address: { street: string; city: string; postal_code: string; country: string };
  items: Array<{ product_name: string; country_name: string; type: string; size: string; quantity: number; unit_price: number }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export default function ConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { closeCart } = useCart();

  useEffect(() => { closeCart(); }, []);

  useEffect(() => {
    if (!orderNumber) return;
    supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle()
      .then(({ data }) => { setOrder(data); setLoading(false); });
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OryginStar size={40} className="animate-pulse-star opacity-60" />
          <span className="text-[9px] tracking-[4px] text-gray-1">CHARGEMENT...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-16 relative"
      style={{ background: 'radial-gradient(ellipse at top, #0d0a04 0%, #080808 50%)' }}
    >
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-8 py-20 text-center">
        {/* Animated star + checkmark */}
        <div className="relative inline-flex items-center justify-center mb-10">
          <OryginStar size={100} className="opacity-20 animate-pulse-star" />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="rgba(201,168,76,0.4)" strokeWidth="0.5" />
              <path d="M12 20l6 6 10-12" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p
          className="text-[9px] tracking-[7px] mb-4"
          style={{ color: '#a07830' }}
        >
          ✦ COMMANDE CONFIRMÉE
        </p>

        <h1
          className="font-cormorant italic mb-3"
          style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, #c9a84c 40%, #f0e0a0 70%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          Merci
        </h1>

        {order ? (
          <>
            <p
              className="font-cormorant italic text-2xl mb-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {order.customer_name}
            </p>
            <p className="text-[10px] tracking-[4px] text-gray-1 mb-3">{order.order_number}</p>
            <p className="text-sm text-gray-3 mb-16">
              Confirmation envoyée à{' '}
              <span className="text-white">{order.customer_email}</span>
            </p>

            {/* Order summary */}
            <div
              className="text-left border border-black-3 mb-6"
              style={{ background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
            >
              <div className="px-6 py-5 border-b border-black-3 flex items-center gap-3">
                <Package size={14} className="text-gold-dark" />
                <span className="text-[9px] tracking-[4px] text-gold-dark">VOTRE COMMANDE</span>
              </div>

              <div className="px-6 py-5 space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-black-3/60 last:border-0">
                    <div>
                      <div className="font-cormorant italic text-sm text-white mb-0.5">{item.product_name}</div>
                      <div className="text-[9px] tracking-[2px] text-gray-1">
                        {item.country_name} · {item.size} · ×{item.quantity}
                      </div>
                    </div>
                    <div className="font-cormorant italic text-gold text-base">
                      {item.unit_price * item.quantity} €
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5 border-t border-black-3 space-y-2">
                <div className="flex justify-between text-[10px] tracking-[2px]">
                  <span className="text-gray-3">Livraison</span>
                  <span className="text-gold text-[9px] tracking-[2px]">OFFERTE</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-black-3">
                  <span className="text-[9px] tracking-[4px] text-white">TOTAL</span>
                  <span
                    className="font-cormorant italic text-3xl"
                    style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {Math.round(order.total / 100)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div
              className="text-left border border-black-3 px-6 py-5 mb-14"
              style={{ background: 'rgba(13,13,13,0.6)' }}
            >
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-4">LIVRAISON À</p>
              <p className="text-sm text-gray-3 leading-relaxed">
                {order.customer_name}<br />
                {order.shipping_address.street}<br />
                {order.shipping_address.postal_code} {order.shipping_address.city}<br />
                {order.shipping_address.country}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-3 mb-16">
            Votre commande a bien été enregistrée. Vous recevrez un email de confirmation.
          </p>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-10 py-4 text-[9px] tracking-[5px] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
              color: '#080808',
              boxShadow: '0 0 40px rgba(201,168,76,0.15)',
            }}
          >
            RETOUR À LA BOUTIQUE
          </Link>
        </div>

        {/* Manifesto */}
        <div className="mt-20 pt-10 border-t border-black-3">
          <OryginStar size={24} className="mx-auto mb-4 opacity-30 animate-shimmer" />
          <p className="font-cormorant italic text-gray-3 text-xl">
            "Chaque culture a une origine. Chaque origine a un style."
          </p>
          <p className="text-[8px] tracking-[5px] text-gray-2 mt-3">— ORYGIN · GLOBAL STREET CULTURE</p>
        </div>
      </div>
    </div>
  );
}
