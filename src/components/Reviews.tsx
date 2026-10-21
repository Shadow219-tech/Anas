import { useState, useEffect, useCallback } from 'react';
import { Star, Send, Check, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Reveal3D from './Reveal3D';

interface Review {
  id: string;
  rating: number;
  name: string;
  comment: string;
  created_at: string;
}

export default function Reviews({ productId, productName }: { productId: string; productName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [website, setWebsite] = useState(''); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('id, rating, name, comment, created_at')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }, [productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (website) return; // honeypot — bot filled it

    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      setError('Tous les champs sont requis.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email invalide.');
      return;
    }
    if (form.comment.trim().length < 10) {
      setError('Le commentaire doit faire au moins 10 caractères.');
      return;
    }

    setSubmitting(true);
    const { error: insErr } = await supabase.from('reviews').insert({
      product_id: productId,
      product_name: productName,
      rating: form.rating,
      name: form.name.trim(),
      email: form.email.trim(),
      comment: form.comment.trim(),
      status: 'pending',
      honeypot_field: null,
    });

    setSubmitting(false);

    if (insErr) {
      setError("Erreur lors de l'envoi. Réessayez.");
      return;
    }

    setSubmitted(true);
    setForm({ name: '', email: '', rating: 5, comment: '' });
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-5 h-5 border border-gold border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="border-t border-black-3 pt-16">
      <Reveal3D>
        <div className="flex items-center gap-4 mb-10">
          <MessageSquare size={14} className="text-gold-dark" />
          <span className="text-[9px] tracking-[5px] text-gold-dark">AVIS CLIENTS</span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    size={12}
                    className={n <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-gray-2'}
                  />
                ))}
              </div>
              <span className="text-[9px] tracking-[2px] text-gray-2">{reviews.length} avis</span>
            </div>
          )}
        </div>
      </Reveal3D>

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {reviews.map((review, i) => (
            <Reveal3D key={review.id} delay={i * 0.08} translateY={30}>
              <div className="border border-black-3 p-6" style={{ background: 'rgba(13,13,13,0.5)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={13} className={n <= review.rating ? 'text-gold fill-gold' : 'text-gray-2'} />
                    ))}
                  </div>
                  <span className="text-[8px] tracking-[2px] text-gray-2">
                    {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-3 leading-relaxed mb-4 italic">"{review.comment}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center text-[10px] font-montserrat"
                    style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))', border: '0.5px solid rgba(201,168,76,0.3)', color: '#c9a84c' }}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-cormorant italic text-sm text-white">{review.name}</span>
                </div>
              </div>
            </Reveal3D>
          ))}
        </div>
      ) : (
        <p className="text-[10px] tracking-[3px] text-gray-2 mb-10">AUCUN AVIS POUR LE MOMENT — SOYEZ LE PREMIER</p>
      )}

      {/* Form toggle / success */}
      {submitted ? (
        <div className="flex items-center justify-center gap-3 py-8 border border-gold-dark/30" style={{ background: 'rgba(201,168,76,0.04)' }}>
          <Check size={16} className="text-gold" />
          <span className="text-[10px] tracking-[4px] text-gold">MERCI — VOTRE AVIS SERA PUBLIÉ APRÈS MODÉRATION</span>
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
          {/* Honeypot */}
          <input type="text" value={website} onChange={e => setWebsite(e.target.value)}
            className="absolute opacity-0 pointer-events-none -left-[9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">NOM</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors"
                placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors"
                placeholder="votre@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-[8px] tracking-[4px] text-gold-dark mb-3">NOTE</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                  className="transition-transform hover:scale-110">
                  <Star size={24} className={n <= form.rating ? 'text-gold fill-gold' : 'text-gray-2'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">COMMENTAIRE</label>
            <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              rows={4}
              className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 transition-colors resize-none"
              placeholder="Partagez votre expérience..." />
          </div>

          {error && <p className="text-[10px] tracking-[2px] text-red-400">{error}</p>}

          <div className="flex gap-4">
            <button type="submit" disabled={submitting}
              className="px-8 py-3.5 text-[9px] tracking-[5px] flex items-center gap-3 transition-all duration-300 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)', color: '#080808' }}>
              {submitting ? (
                <><div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />ENVOI...</>
              ) : (
                <><Send size={12} />PUBLIER MON AVIS</>
              )}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="text-[9px] tracking-[3px] text-gray-2 hover:text-white transition-colors px-4 py-3.5">
              ANNULER
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-3 text-[9px] tracking-[4px] text-gold border border-gold-dark/40 px-6 py-3.5 hover:bg-gold-dark/10 transition-colors">
          <Star size={12} />LAISSER UN AVIS
        </button>
      )}
    </div>
  );
}
