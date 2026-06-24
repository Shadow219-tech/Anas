import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronRight, Lock, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import OryginStar from '../components/OryginStar';

// ── Stripe init ────────────────────────────────────────────────────────────────
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// ── Stripe appearance theme — luxury black & gold ─────────────────────────────
const STRIPE_APPEARANCE = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#c9a84c',
    colorBackground: '#0d0d0d',
    colorText: '#ffffff',
    colorTextSecondary: '#888888',
    colorTextPlaceholder: '#555555',
    colorIcon: '#c9a84c',
    colorIconCardError: '#ef4444',
    colorSuccess: '#c9a84c',
    colorDanger: '#ef4444',
    fontFamily: '"Montserrat", sans-serif',
    fontSizeBase: '13px',
    fontWeightNormal: '300',
    borderRadius: '0px',
    spacingUnit: '4px',
    focusBoxShadow: '0 0 0 2px rgba(201,168,76,0.2)',
    focusOutline: '1px solid rgba(201,168,76,0.4)',
  },
  rules: {
    '.Input': {
      backgroundColor: '#141414',
      border: '0.5px solid #2a2a2a',
      color: '#ffffff',
      padding: '14px 16px',
      fontSize: '13px',
      fontWeight: '300',
      letterSpacing: '0.5px',
      transition: 'border-color 0.2s',
    },
    '.Input:focus': {
      border: '0.5px solid rgba(201,168,76,0.5)',
      boxShadow: '0 0 20px rgba(201,168,76,0.05)',
      outline: 'none',
    },
    '.Input--invalid': {
      border: '0.5px solid rgba(239,68,68,0.5)',
    },
    '.Label': {
      color: '#a07830',
      fontSize: '8px',
      letterSpacing: '4px',
      fontWeight: '400',
      marginBottom: '8px',
      textTransform: 'uppercase',
    },
    '.Tab': {
      backgroundColor: '#141414',
      border: '0.5px solid #2a2a2a',
      color: '#888888',
      borderRadius: '0px',
      padding: '12px 20px',
    },
    '.Tab:hover': {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      border: '0.5px solid #555555',
    },
    '.Tab--selected': {
      backgroundColor: 'rgba(201,168,76,0.08)',
      border: '0.5px solid rgba(201,168,76,0.4)',
      color: '#c9a84c',
      boxShadow: '0 0 20px rgba(201,168,76,0.05)',
    },
    '.Tab--selected:focus': {
      boxShadow: '0 0 20px rgba(201,168,76,0.08)',
    },
    '.TabIcon--selected': { fill: '#c9a84c' },
    '.TabLabel--selected': { color: '#c9a84c' },
    '.Block': {
      backgroundColor: '#141414',
      border: '0.5px solid #2a2a2a',
    },
    '.Error': { color: '#ef4444', fontSize: '11px' },
    '.PickerItem': {
      backgroundColor: '#141414',
      border: '0.5px solid #2a2a2a',
    },
    '.PickerItem--selected': {
      backgroundColor: 'rgba(201,168,76,0.08)',
      border: '0.5px solid rgba(201,168,76,0.4)',
    },
  },
};

// ── helpers ────────────────────────────────────────────────────────────────────
function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORY-${ts}${rand}`;
}

const COUNTRIES_LIST = [
  'France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Tunisie', 'Algérie',
  'Sénégal', "Côte d'Ivoire", 'États-Unis', 'Royaume-Uni', 'Espagne',
  'Italie', 'Allemagne', 'Portugal', 'Pays-Bas', 'Autre',
];

interface ShippingForm {
  firstName: string; lastName: string;
  email: string; phone: string;
  address: string; city: string;
  postalCode: string; country: string;
}

// ── Stripe Payment Form (inner — must be inside <Elements>) ───────────────────
function StripePaymentForm({
  clientSecret,
  orderNumber,
  orderId,
  onSuccess,
}: {
  clientSecret: string;
  orderNumber: string;
  orderId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? 'Erreur'); setLoading(false); return; }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/confirmation/${orderNumber}`,
      },
      redirect: 'if_required',
    });

    if (confirmErr) {
      setError(confirmErr.message ?? 'Paiement refusé. Réessayez.');
      setLoading(false);
    } else {
      // Payment succeeded without redirect (e.g. card)
      await supabase
        .from('orders')
        .update({ status: 'paid', stripe_payment_status: 'succeeded' })
        .eq('id', orderId);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement
          options={{
            layout: { type: 'tabs', defaultCollapsed: false },
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay', 'paypal'],
            fields: { billingDetails: { email: 'never' } },
          }}
        />
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 border border-red-900/40 bg-red-950/20 text-red-400 text-[10px] tracking-[2px]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 text-[9px] tracking-[5px] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: loading ? '#a07830' : 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
          color: '#080808',
          boxShadow: '0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.05)',
        }}
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />
            TRAITEMENT EN COURS...
          </>
        ) : (
          <>
            <Lock size={12} />
            CONFIRMER LE PAIEMENT
          </>
        )}
      </button>
    </form>
  );
}

// ── Main Checkout Page ─────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total, closeCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [preparingPayment, setPreparingPayment] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const [form, setForm] = useState<ShippingForm>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: 'France',
  });

  // Pre-fill from profile when logged in
  useEffect(() => {
    if (profile) {
      const parts = (profile.full_name || '').split(' ');
      setForm(f => ({
        ...f,
        firstName: parts[0] || f.firstName,
        lastName: parts.slice(1).join(' ') || f.lastName,
        email: profile.email || f.email,
        phone: profile.phone || f.phone,
        address: profile.address || f.address,
        city: profile.city || f.city,
        postalCode: profile.postal_code || f.postalCode,
        country: profile.country || f.country,
      }));
    }
  }, [profile]);

  const updateField = (field: keyof ShippingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validateShipping = () => {
    const required: (keyof ShippingForm)[] = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country'];
    for (const f of required) if (!form[f].trim()) return `Le champ est requis.`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email invalide.';
    return null;
  };

  const handleShippingNext = async () => {
    const err = validateShipping();
    if (err) { setShippingError(err); return; }
    setShippingError(null);
    setPreparingPayment(true);

    try {
      const num = generateOrderNumber();
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        country_code: i.countryCode,
        country_name: i.countryName,
        type: i.product.type,
        size: i.size,
        quantity: i.quantity,
        unit_price: i.product.price,
      }));

      // Create order in DB
      const { data: order, error: dbErr } = await supabase
        .from('orders')
        .insert({
          order_number: num,
          status: 'pending',
          customer_email: form.email,
          customer_name: `${form.firstName} ${form.lastName}`,
          customer_phone: form.phone || null,
          shipping_address: { street: form.address, city: form.city, postal_code: form.postalCode, country: form.country },
          items: orderItems,
          subtotal: total * 100,
          shipping_cost: 0,
          total: total * 100,
          ...(user ? { user_id: user.id } : {}),
        })
        .select('id, order_number')
        .single();

      if (dbErr) throw new Error(dbErr.message);

      // Create Stripe Payment Intent via edge function
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`;
      const res = await fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          amount: total * 100,
          currency: 'eur',
          customerEmail: form.email,
          customerName: `${form.firstName} ${form.lastName}`,
          items: orderItems,
          shippingAddress: { street: form.address, city: form.city, postal_code: form.postalCode, country: form.country },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur serveur (${res.status})`);
      }

      const { clientSecret: cs } = await res.json();
      if (!cs) throw new Error('Stripe non configuré. Ajoutez votre clé STRIPE_SECRET_KEY.');

      setClientSecret(cs);
      setOrderId(order.id);
      setOrderNumber(order.order_number);
      setStep('payment');
    } catch (err: any) {
      setShippingError(err.message || 'Erreur. Réessayez.');
    } finally {
      setPreparingPayment(false);
    }
  };

  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);

  const handlePaymentSuccess = useCallback(() => {
    closeCart();
    navigate(`/confirmation/${orderNumber}`);
  }, [navigate, orderNumber, closeCart]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex flex-col items-center justify-center text-center px-8">
        <OryginStar size={48} className="mx-auto mb-6 opacity-30 animate-float" />
        <h1 className="font-cormorant italic text-5xl text-white mb-4">Panier vide</h1>
        <p className="text-[10px] tracking-[4px] text-gray-1 mb-10">AJOUTEZ DES PIÈCES POUR CONTINUER</p>
        <Link to="/" className="text-[9px] tracking-[5px] text-gold border border-gold-dark/50 px-8 py-3.5 hover:bg-gold/5 transition-colors">
          EXPLORER LA BOUTIQUE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-1 pt-16" style={{ background: 'radial-gradient(ellipse at top, #0d0a04 0%, #080808 60%)' }}>
      {/* Golden ambient top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <OryginStar size={22} />
            <span className="font-cormorant italic text-2xl text-white">Finaliser la commande</span>
          </div>
          <Link to="/" className="text-[8px] tracking-[4px] text-gray-2 hover:text-gold transition-colors">
            ← BOUTIQUE
          </Link>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-12">
          <StepIndicator num={1} label="LIVRAISON" active={step === 'shipping'} done={step === 'payment'} />
          <div className="flex-1 h-px bg-gradient-to-r from-black-3 to-transparent" />
          <StepIndicator num={2} label="PAIEMENT" active={step === 'payment'} done={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left */}
          <div>
            {/* Guest nudge — shown only when not logged in, on shipping step */}
            {!user && step === 'shipping' && (
              <div
                className="flex items-center justify-between p-4 mb-8 border"
                style={{ border: '0.5px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}
              >
                <span className="text-[9px] tracking-[3px] text-gray-3">DÉJÀ UN COMPTE ?</span>
                <button
                  onClick={() => setAuthModal('signin')}
                  className="text-[9px] tracking-[4px] text-gold hover:text-gold-light transition-colors underline underline-offset-4"
                >
                  SE CONNECTER
                </button>
              </div>
            )}

            {step === 'shipping' && (
              <ShippingStep
                form={form}
                updateField={updateField}
                error={shippingError}
                loading={preparingPayment}
                onNext={handleShippingNext}
              />
            )}

            {step === 'payment' && clientSecret && orderNumber && orderId && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] tracking-[5px] text-gold-dark">MODE DE PAIEMENT</h2>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-[8px] tracking-[3px] text-gray-2 hover:text-white transition-colors"
                  >
                    ← MODIFIER
                  </button>
                </div>

                {/* Summary of shipping */}
                <div className="mb-8 p-4 border border-black-3 bg-black-2/50 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] tracking-[3px] text-gold-dark mb-1">LIVRAISON À</p>
                    <p className="text-sm text-white">{form.firstName} {form.lastName}</p>
                    <p className="text-[10px] text-gray-3">{form.address}, {form.city}</p>
                  </div>
                  <span className="text-xs text-gray-3">{form.email}</span>
                </div>

                {stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: STRIPE_APPEARANCE,
                      fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap' }],
                    }}
                  >
                    <StripePaymentForm
                      clientSecret={clientSecret}
                      orderNumber={orderNumber}
                      orderId={orderId}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                ) : (
                  <div className="p-6 border border-gold-dark/30 bg-gold/5 text-center">
                    <p className="text-[9px] tracking-[4px] text-gold-dark mb-3">STRIPE NON CONFIGURÉ</p>
                    <p className="text-sm text-gray-3">Ajoutez votre clé <code className="text-gold text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> dans le fichier .env pour activer les paiements.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <OrderSummary items={items} total={total} />
        </div>
      </div>

      {authModal && (
        <AuthModal defaultMode={authModal} onClose={() => setAuthModal(null)} />
      )}
    </div>
  );
}

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ num, label, active, done }: { num: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 transition-all duration-300 ${active ? 'opacity-100' : done ? 'opacity-60' : 'opacity-30'}`}>
      <div
        className="w-6 h-6 flex items-center justify-center text-[9px] border transition-all duration-300"
        style={active
          ? { border: '1px solid rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }
          : done
          ? { border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)', color: '#c9a84c' }
          : { border: '1px solid #2a2a2a', color: '#555' }
        }
      >
        {done ? <CheckCircle size={12} /> : num}
      </div>
      <span className={`text-[8px] tracking-[4px] transition-colors ${active ? 'text-gold' : 'text-gray-2'}`}>
        {label}
      </span>
    </div>
  );
}

// ── Shipping Step ──────────────────────────────────────────────────────────────
function ShippingStep({ form, updateField, error, loading, onNext }: {
  form: ShippingForm;
  updateField: (f: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error: string | null;
  loading: boolean;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-[10px] tracking-[5px] text-gold-dark mb-8">ADRESSE DE LIVRAISON</h2>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="PRÉNOM" value={form.firstName} onChange={updateField('firstName')} placeholder="Anas" />
          <FormField label="NOM" value={form.lastName} onChange={updateField('lastName')} placeholder="Ezzine" />
        </div>
        <FormField label="EMAIL" type="email" value={form.email} onChange={updateField('email')} placeholder="votre@email.com" />
        <FormField label="TÉLÉPHONE" type="tel" value={form.phone} onChange={updateField('phone')} placeholder="+33 6 00 00 00 00" />
        <FormField label="ADRESSE" value={form.address} onChange={updateField('address')} placeholder="12 rue de la Paix" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="VILLE" value={form.city} onChange={updateField('city')} placeholder="Paris" />
          <FormField label="CODE POSTAL" value={form.postalCode} onChange={updateField('postalCode')} placeholder="75001" />
        </div>
        <div>
          <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">PAYS</label>
          <select
            value={form.country}
            onChange={updateField('country')}
            className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white outline-none transition-colors appearance-none hover:border-gray-2 focus:border-gold-dark/50"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23555\' stroke-width=\'1.5\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
          >
            {COUNTRIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-6 px-4 py-3 border border-red-900/40 bg-red-950/20 text-red-400 text-[10px] tracking-[2px]">
          {error}
        </div>
      )}

      <button
        onClick={onNext}
        disabled={loading}
        className="mt-8 w-full py-4 text-[9px] tracking-[5px] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
          color: '#080808',
          boxShadow: loading ? 'none' : '0 0 40px rgba(201,168,76,0.15)',
        }}
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />
            PRÉPARATION DU PAIEMENT...
          </>
        ) : (
          <>CONTINUER VERS LE PAIEMENT <ChevronRight size={12} /></>
        )}
      </button>
    </div>
  );
}

function FormField({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 hover:border-gray-2 transition-colors"
      />
    </div>
  );
}

// ── Order Summary ──────────────────────────────────────────────────────────────
function OrderSummary({ items, total }: {
  items: ReturnType<typeof useCart>['items'];
  total: number;
}) {
  return (
    <div
      className="border border-black-3 sticky top-24"
      style={{ background: 'rgba(13,13,13,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(0,0,0,0.4)' }}
    >
      <div className="px-6 py-5 border-b border-black-3 flex items-center gap-3">
        <ShoppingBag size={14} className="text-gold-dark" />
        <span className="text-[9px] tracking-[4px] text-gold-dark">VOTRE COMMANDE</span>
      </div>

      <div className="px-6 py-5 space-y-5 max-h-72 overflow-y-auto">
        {items.map(item => (
          <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-20 object-cover"
                style={{ filter: 'brightness(1.05) contrast(1.05)' }}
              />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-black-1 text-[8px] flex items-center justify-center font-montserrat">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-cormorant italic text-sm text-white leading-tight mb-0.5">{item.product.name}</div>
              <div className="text-[9px] tracking-[2px] text-gray-1">{item.countryName} · {item.size}</div>
            </div>
            <div className="font-cormorant italic text-gold text-sm flex-shrink-0">
              {item.product.price * item.quantity} €
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-5 border-t border-black-3 space-y-3">
        <div className="flex justify-between text-[10px] tracking-[2px]">
          <span className="text-gray-3">Sous-total</span>
          <span className="text-white">{total} €</span>
        </div>
        <div className="flex justify-between text-[10px] tracking-[2px]">
          <span className="text-gray-3">Livraison</span>
          <span className="text-gold text-[10px] tracking-[2px]">OFFERTE</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-black-3 items-baseline">
          <span className="text-[9px] tracking-[4px] text-white">TOTAL</span>
          <span
            className="font-cormorant italic text-3xl"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {total} €
          </span>
        </div>
      </div>

      {/* Security badges */}
      <div className="px-6 py-4 border-t border-black-3 flex items-center gap-2 justify-center">
        <Lock size={10} className="text-gray-2" />
        <span className="text-[7px] tracking-[2px] text-gray-2">PAIEMENT SÉCURISÉ STRIPE</span>
      </div>
    </div>
  );
}
