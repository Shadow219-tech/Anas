import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../data/countries';
import OryginStar from './OryginStar';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);
  const { count, openCart } = useCart();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setQuery('');
  }, [location.pathname]);

  const results = query.length > 1
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const navLinks = [
    { to: '/', label: 'ACCUEIL' },
    { to: '/afrique', label: 'AFRIQUE' },
    { to: '/asie', label: 'ASIE' },
    { to: '/ameriques', label: 'AMÉRIQUES' },
    { to: '/europe', label: 'EUROPE' },
    { to: '/oceanie', label: 'OCÉANIE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black-1/95 backdrop-blur-md border-b border-black-3' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-8 h-16">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[9px] tracking-[4px] transition-colors duration-200 ${
                  location.pathname === link.to ? 'text-gold' : 'text-gray-3 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group md:absolute md:left-1/2 md:-translate-x-1/2">
            <OryginStar size={28} />
            <span className="font-cormorant italic text-xl text-gold-gradient leading-none">Orygin</span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-5 flex-1 justify-end">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="text-gray-3 hover:text-gold transition-colors"
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            {/* Auth button */}
            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 text-gray-3 hover:text-gold transition-colors"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center text-[10px] font-montserrat"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                      border: '0.5px solid rgba(201,168,76,0.3)',
                      color: '#c9a84c',
                    }}
                  >
                    {profile?.avatar_initials ?? <User size={12} />}
                  </div>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 border border-black-3 bg-black-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-black-3">
                    <p className="text-[8px] tracking-[3px] text-gold-dark">CONNECTÉ</p>
                    <p className="text-xs text-white truncate mt-0.5">{profile?.full_name || user.email}</p>
                  </div>
                  <Link
                    to="/compte"
                    className="flex items-center gap-3 px-4 py-3 text-[9px] tracking-[3px] text-gray-3 hover:text-gold hover:bg-black-3 transition-colors"
                  >
                    <User size={11} />
                    MON COMPTE
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[9px] tracking-[3px] text-gray-3 hover:text-white hover:bg-black-3 transition-colors border-t border-black-3"
                  >
                    <X size={11} />
                    DÉCONNEXION
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAuthModal('signin')}
                className="text-gray-3 hover:text-gold transition-colors"
                title="Connexion"
              >
                <User size={16} />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-gray-3 hover:text-gold transition-colors"
            >
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-black-1 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-montserrat">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-black-3 bg-black-1/98 px-8 py-4 relative">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cherchez un pays, un continent..."
              className="w-full bg-transparent border-b border-gray-2 pb-2 text-sm text-white placeholder-gray-1 outline-none font-montserrat tracking-wider"
            />
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black-2 border border-black-3 z-50">
                {results.map(c => (
                  <Link
                    key={c.code}
                    to={`/pays/${c.code.toLowerCase()}`}
                    className="flex items-center gap-4 px-8 py-3 hover:bg-black-3 transition-colors group"
                  >
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <div className="font-cormorant italic text-sm text-white group-hover:text-gold transition-colors">{c.name}</div>
                      <div className="text-[9px] tracking-[2px] text-gray-1">{c.subtitle}</div>
                    </div>
                    <div className="ml-auto">
                      {c.status === 'available'
                        ? <span className="text-[8px] tracking-[3px] text-gold">✦ DISPONIBLE</span>
                        : <span className="text-[8px] tracking-[3px] text-gray-2">— BIENTÔT</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          defaultMode={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}
