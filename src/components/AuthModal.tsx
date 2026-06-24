import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OryginStar from './OryginStar';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Entrez votre nom complet.'); setLoading(false); return; }
      if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName.trim());
      if (error) { setError(error); setLoading(false); return; }
      setSuccess(true);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.includes('Invalid login') ? 'Email ou mot de passe incorrect.' : error);
        setLoading(false);
        return;
      }
      onClose();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <ModalShell onClose={onClose}>
        <div className="flex flex-col items-center text-center py-8">
          <div className="relative mb-8">
            <OryginStar size={80} className="opacity-20 animate-pulse-star" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l8 8L26 8" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <p className="text-[9px] tracking-[6px] text-gold-dark mb-3">BIENVENUE</p>
          <h3 className="font-cormorant italic text-3xl text-white mb-3">Compte créé !</h3>
          <p className="text-sm text-gray-3 mb-8 leading-relaxed">
            Votre compte <span className="text-white">{email}</span> est prêt.<br />
            Vous êtes maintenant connecté.
          </p>
          <button
            onClick={onClose}
            className="px-10 py-3.5 text-[9px] tracking-[5px]"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0, #c9a84c)', color: '#080808', boxShadow: '0 0 30px rgba(201,168,76,0.2)' }}
          >
            EXPLORER LA BOUTIQUE
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      {/* Tab toggle */}
      <div className="flex border-b border-black-3 mb-8">
        {(['signin', 'signup'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={`flex-1 py-4 text-[9px] tracking-[4px] transition-all duration-300 border-b-[1px] ${
              mode === m
                ? 'text-gold border-gold-dark'
                : 'text-gray-2 border-transparent hover:text-white'
            }`}
          >
            {m === 'signin' ? 'CONNEXION' : 'INSCRIPTION'}
          </button>
        ))}
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="font-cormorant italic text-3xl text-white mb-1">
          {mode === 'signin' ? 'Bon retour' : 'Rejoindre Orygin'}
        </h2>
        <p className="text-[9px] tracking-[3px] text-gray-2">
          {mode === 'signin' ? 'CONNECTEZ-VOUS À VOTRE COMPTE' : 'CRÉEZ VOTRE COMPTE GRATUIT'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <AuthField
            label="NOM COMPLET"
            type="text"
            value={fullName}
            onChange={setFullName}
            placeholder="Anas Ezzine"
            autoFocus
          />
        )}

        <AuthField
          label="EMAIL"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="votre@email.com"
          autoFocus={mode === 'signin'}
        />

        <div>
          <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">MOT DE PASSE</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Minimum 6 caractères' : '••••••••'}
              required
              className="w-full bg-black-3 border border-black-3 px-4 py-3.5 pr-12 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 hover:border-gray-2 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-2 hover:text-gold transition-colors"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 border border-red-900/40 bg-red-950/20 text-red-400 text-[10px] tracking-[2px]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 text-[9px] tracking-[5px] flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-60"
          style={{
            background: loading ? '#a07830' : 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
            color: '#080808',
            boxShadow: loading ? 'none' : '0 0 40px rgba(201,168,76,0.15)',
          }}
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black-1/40 border-t-black-1 rounded-full animate-spin" />
              {mode === 'signin' ? 'CONNEXION...' : 'CRÉATION...'}
            </>
          ) : (
            <>
              {mode === 'signin' ? 'SE CONNECTER' : "CRÉER MON COMPTE"}
              <ArrowRight size={12} />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[9px] tracking-[2px] text-gray-2 mt-6">
        {mode === 'signin' ? "Pas encore de compte ?" : "Déjà un compte ?"}
        {' '}
        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
          className="text-gold hover:text-gold-light underline underline-offset-4 transition-colors"
        >
          {mode === 'signin' ? "S'inscrire" : 'Se connecter'}
        </button>
      </p>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 60%)' }}
      />

      <div
        className="relative w-full max-w-md"
        style={{
          background: 'rgba(10,10,10,0.95)',
          border: '0.5px solid rgba(201,168,76,0.2)',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.05), inset 0 0 0 0.5px rgba(255,255,255,0.02)',
        }}
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-0">
          <div className="flex items-center gap-2">
            <OryginStar size={18} />
            <span className="font-cormorant italic text-base text-gold-gradient">Orygin</span>
          </div>
          <button onClick={onClose} className="text-gray-2 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-8 pb-8 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, type, value, onChange, placeholder, autoFocus }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="block text-[8px] tracking-[4px] text-gold-dark mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required
        className="w-full bg-black-3 border border-black-3 px-4 py-3.5 text-sm text-white placeholder-gray-2 outline-none focus:border-gold-dark/50 hover:border-gray-2 transition-colors"
      />
    </div>
  );
}
