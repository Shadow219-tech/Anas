import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES, CONTINENTS } from '../data/countries';
import OryginStar from '../components/OryginStar';
import Ticker from '../components/Ticker';
import Countdown from '../components/Countdown';

const DROP_TARGET = new Date('2026-09-15T00:00:00');

const AVAILABLE_COUNTRIES = COUNTRIES.filter(c => c.status === 'available');

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof COUNTRIES>([]);

  useEffect(() => {
    if (query.length > 1) {
      setSearchResults(
        COUNTRIES.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      );
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-black-1">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center stars-bg overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-gold/5 to-transparent pointer-events-none" />

        {/* Decorative corner stars */}
        <div className="absolute top-32 left-16 opacity-20 animate-float">
          <OryginStar size={60} />
        </div>
        <div className="absolute bottom-40 right-20 opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>
          <OryginStar size={80} />
        </div>
        <div className="absolute top-48 right-32 opacity-10 animate-float" style={{ animationDelay: '3s' }}>
          <OryginStar size={40} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="opacity-0 animate-fade-in-up animate-delay-100 mb-8">
            <span className="inline-flex items-center gap-2 border border-gold-dark/40 px-5 py-2 text-[9px] tracking-[5px] text-gold-dark">
              ✦ DROP 001 — QUATRE ORIGINES
            </span>
          </div>

          {/* Star */}
          <div className="opacity-0 animate-starburst-in animate-delay-200 mb-6">
            <OryginStar size={80} animated />
          </div>

          {/* Title */}
          <div className="opacity-0 animate-fade-in-up animate-delay-300">
            <h1 className="font-cormorant italic font-light text-[100px] leading-[0.9] text-gold-gradient mb-4">
              Orygin
            </h1>
          </div>

          {/* Subtitle */}
          <div className="opacity-0 animate-fade-in-up animate-delay-400 mb-2">
            <p className="text-[11px] tracking-[8px] text-gray-3">GLOBAL STREET CULTURE</p>
          </div>

          {/* Countries */}
          <div className="opacity-0 animate-fade-in-up animate-delay-500 mb-10">
            <p className="text-[10px] tracking-[4px] text-gold-dark/70">
              USA · JAPAN · ARGENTINA · MOROCCO · ET PLUS
            </p>
          </div>

          {/* Search */}
          <div className="opacity-0 animate-fade-in-up animate-delay-500 w-full max-w-lg mb-8 relative">
            <div className="flex items-center border border-black-3 bg-black-2/60 backdrop-blur-sm">
              <svg className="ml-4 flex-shrink-0 text-gray-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cherchez un pays, un continent..."
                className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-gray-1 outline-none font-montserrat tracking-wide"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-black-2 border border-black-3 z-40 text-left shadow-2xl">
                {searchResults.map(c => (
                  <Link
                    key={c.code}
                    to={`/pays/${c.code.toLowerCase()}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-black-3 transition-colors group border-b border-black-3 last:border-0"
                  >
                    <span className="text-xl flex-shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-cormorant italic text-sm text-white group-hover:text-gold transition-colors">{c.name}</div>
                      <div className="text-[9px] tracking-[2px] text-gray-1 truncate">{c.subtitle}</div>
                    </div>
                    {c.status === 'available' ? (
                      <span className="text-[8px] tracking-[3px] text-gold flex-shrink-0">✦ DISPONIBLE</span>
                    ) : (
                      <span className="text-[8px] tracking-[3px] text-gray-2 flex-shrink-0">— BIENTÔT</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="opacity-0 animate-fade-in-up animate-delay-500 flex gap-4 flex-wrap justify-center">
            <Link
              to="/afrique"
              className="px-8 py-3.5 bg-gold text-black-1 text-[9px] tracking-[4px] hover:bg-gold-light transition-colors duration-300"
            >
              EXPLORER LES CONTINENTS
            </Link>
            <Link
              to="/histoire"
              className="px-8 py-3.5 border border-gold-dark/50 text-white text-[9px] tracking-[4px] hover:border-gold hover:text-gold transition-all duration-300"
            >
              NOTRE HISTOIRE
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
          <span className="text-[7px] tracking-[4px] text-gold-dark">SCROLL</span>
        </div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* AVAILABLE COUNTRIES */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <OryginStar size={16} />
          <span className="text-[9px] tracking-[5px] text-gold-dark">PAYS DISPONIBLES</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVAILABLE_COUNTRIES.map((country, i) => (
            <Link
              key={country.code}
              to={`/pays/${country.code.toLowerCase()}`}
              className="relative group overflow-hidden aspect-[3/4] block"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {country.heroImage && (
                <img
                  src={country.heroImage}
                  alt={country.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black-1 via-black-1/40 to-transparent" />
              <div className="absolute inset-0 bg-black-1/20 group-hover:bg-black-1/10 transition-colors duration-300" />

              <div className="absolute top-4 left-4">
                <span className="text-[8px] tracking-[3px] text-gold border border-gold-dark/50 px-2 py-1">
                  ✦ DISPONIBLE
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-[10px] tracking-[3px] text-gray-3 mb-1">{country.code}</div>
                <div className="font-cormorant italic text-2xl text-white group-hover:text-gold transition-colors duration-300 mb-1">
                  {country.name}
                </div>
                <div className="text-[9px] tracking-[1px] text-gray-3 italic">
                  {country.subtitle}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTINENTS GRID */}
      <section className="py-16 px-8 max-w-7xl mx-auto border-t border-black-3">
        <div className="flex items-center gap-4 mb-12">
          <OryginStar size={16} />
          <span className="text-[9px] tracking-[5px] text-gold-dark">CINQ CONTINENTS</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CONTINENTS.map(continent => (
            <Link
              key={continent.id}
              to={`/${continent.id}`}
              className="group border border-black-3 p-6 text-center hover:border-gold-dark transition-all duration-300"
            >
              <div className="text-4xl mb-4">{continent.emoji}</div>
              <div className="font-cormorant italic text-lg text-white group-hover:text-gold transition-colors mb-2">
                {continent.name}
              </div>
              <div className="text-[8px] tracking-[2px] text-gray-1 mb-3">
                {continent.countryCount} PAYS
              </div>
              {continent.status === 'available' ? (
                <span className="text-[8px] tracking-[3px] text-gold">✦ DISPONIBLE</span>
              ) : (
                <span className="text-[8px] tracking-[3px] text-gray-2">— BIENTÔT</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-20 px-8 border-t border-black-3 text-center">
        <p className="text-[9px] tracking-[6px] text-gray-1 mb-10">PROCHAIN DROP DANS</p>
        <Countdown targetDate={DROP_TARGET} />
      </section>

      {/* EMAIL SIGNUP */}
      <section className="py-20 px-8 border-t border-black-3 text-center">
        <OryginStar size={32} className="mx-auto mb-6 opacity-60" />
        <h2 className="font-cormorant italic text-4xl text-white mb-3">
          Rejoindre le mouvement
        </h2>
        <p className="text-[10px] tracking-[3px] text-gray-1 mb-8">
          SOYEZ NOTIFIÉ EN AVANT-PREMIÈRE
        </p>
        <EmailSignup />
      </section>

      {/* MANIFESTO QUOTE */}
      <section className="py-24 px-8 border-t border-black-3 text-center">
        <OryginStar size={28} className="mx-auto mb-8 opacity-40 animate-shimmer" />
        <p className="text-[8px] tracking-[5px] text-gold-dark mb-6">MANIFESTO</p>
        <blockquote className="font-cormorant italic text-4xl md:text-5xl text-white max-w-2xl mx-auto leading-tight mb-6">
          "Chaque culture a une origine.<br />Chaque origine a un style."
        </blockquote>
        <div className="w-8 h-px bg-gold-dark/30 mx-auto mb-4" />
        <p className="text-[8px] tracking-[5px] text-gold-dark">
          — ORYGIN · GLOBAL STREET CULTURE
        </p>
      </section>
    </div>
  );
}

function EmailSignup() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3">
        <OryginStar size={24} className="text-gold" />
        <p className="text-[10px] tracking-[4px] text-gold">INSCRIT — À BIENTÔT</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md mx-auto gap-0">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        className="flex-1 bg-black-2 border border-black-3 border-r-0 px-5 py-3.5 text-sm text-white placeholder-gray-1 outline-none font-montserrat tracking-wide"
      />
      <button
        type="submit"
        className="bg-gold text-black-1 px-6 py-3.5 text-[9px] tracking-[4px] hover:bg-gold-light transition-colors duration-300 flex-shrink-0"
      >
        S'INSCRIRE
      </button>
    </form>
  );
}
