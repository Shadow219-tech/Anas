import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRIES, CONTINENTS, PRODUCTS_BY_COUNTRY, AVAILABLE_COUNTRIES } from '../data/countries';
import OryginStar from '../components/OryginStar';
import Star3D from '../components/Star3D';
import Ticker from '../components/Ticker';
import Scene3D from '../components/Scene3D';
import TiltCard3D from '../components/TiltCard3D';
import Reveal3D from '../components/Reveal3D';
import Reviews from '../components/Reviews';

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
        <Scene3D count={50} />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-gold/5 to-transparent pointer-events-none" />

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
          <div className="opacity-0 animate-fade-in-up animate-delay-100 mb-8">
            <span className="inline-flex items-center gap-2 border border-gold-dark/40 px-5 py-2 text-[9px] tracking-[5px] text-gold-dark">
              ✦ DROP 001 — UN ENSEMBLE PAR PAYS
            </span>
          </div>

          <div className="opacity-0 animate-fade-in-up animate-delay-200 mb-6">
            <Star3D size={140} />
          </div>

          <div className="opacity-0 animate-fade-in-up animate-delay-300">
            <h1 className="font-cormorant italic font-light text-[100px] leading-[0.9] text-gold-gradient mb-4">
              Orygin
            </h1>
          </div>

          <div className="opacity-0 animate-fade-in-up animate-delay-400 mb-2">
            <p className="text-[11px] tracking-[8px] text-gray-3">GLOBAL STREET CULTURE</p>
          </div>

          <div className="opacity-0 animate-fade-in-up animate-delay-500 mb-10">
            <p className="text-[10px] tracking-[4px] text-gold-dark/70">
              MAROC · ÉTATS-UNIS · ET PLUS
            </p>
          </div>

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

          <div className="opacity-0 animate-fade-in-up animate-delay-500 flex gap-4 flex-wrap justify-center">
            <Link
              to="/afrique"
              className="px-8 py-3.5 bg-gold text-black-1 text-[9px] tracking-[4px] hover:bg-gold-light transition-colors duration-300"
            >
              EXPLORER LES ENSEMBLES
            </Link>
            <Link
              to="/histoire"
              className="px-8 py-3.5 border border-gold-dark/50 text-white text-[9px] tracking-[4px] hover:border-gold hover:text-gold transition-all duration-300"
            >
              NOTRE HISTOIRE
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
          <span className="text-[7px] tracking-[4px] text-gold-dark">SCROLL</span>
        </div>
      </section>

      <Ticker />

      {/* JACKET COLLECTION */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <Reveal3D>
          <div className="flex items-center gap-4 mb-4">
            <OryginStar size={16} />
            <span className="text-[9px] tracking-[5px] text-gold-dark">UN ENSEMBLE PAR PAYS</span>
          </div>
        </Reveal3D>
        <Reveal3D delay={0.1}>
          <h2 className="font-cormorant italic text-4xl md:text-5xl text-white mb-12 max-w-2xl">
            Chaque pays, un ensemble. Chaque ensemble, une histoire.
          </h2>
        </Reveal3D>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AVAILABLE_COUNTRIES.map((country, i) => {
            const jacket = PRODUCTS_BY_COUNTRY[country.code]?.[0];
            if (!jacket) return null;
            return (
              <Reveal3D key={country.code} delay={i * 0.15} rotateX={20} translateY={60}>
                <Link to={`/produit/${jacket.id}`} className="block group">
                  <TiltCard3D intensity={12} className="relative overflow-hidden aspect-[3/4] block shadow3d">
                    <img
                      src={jacket.images[0]}
                      alt={jacket.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-1 via-black-1/40 to-transparent" />
                    <div className="absolute inset-0 bg-black-1/20 group-hover:bg-black-1/10 transition-colors duration-300" />

                    <div className="absolute top-4 left-4">
                      <span className="text-[8px] tracking-[3px] text-gold border border-gold-dark/50 px-2 py-1 bg-black-1/60 backdrop-blur-sm">
                        ✦ {country.code} · DISPONIBLE
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="text-[8px] tracking-[3px] text-gold-dark bg-black-1/85 px-3 py-1.5 backdrop-blur-sm border border-black-3">
                        ENSEMBLE
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-[10px] tracking-[3px] text-gray-3 mb-1">{country.flag} {country.name}</div>
                      <div className="font-cormorant italic text-3xl text-white group-hover:text-gold transition-colors duration-300 mb-2">
                        {jacket.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] tracking-[1px] text-gray-3 italic">{country.subtitle}</div>
                        <div
                          className="font-cormorant italic text-xl"
                          style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                          {jacket.price} €
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                </Link>
              </Reveal3D>
            );
          })}
        </div>
      </section>

      {/* CONTINENTS GRID */}
      <section className="py-16 px-8 max-w-7xl mx-auto border-t border-black-3">
        <Reveal3D>
          <div className="flex items-center gap-4 mb-12">
            <OryginStar size={16} />
            <span className="text-[9px] tracking-[5px] text-gold-dark">CINQ CONTINENTS</span>
          </div>
        </Reveal3D>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CONTINENTS.map((continent, i) => (
            <Reveal3D key={continent.id} delay={i * 0.1} rotateX={18} translateY={50}>
              <Link to={`/${continent.id}`} className="block">
                <TiltCard3D intensity={16} glare={false} className="group border border-black-3 p-6 text-center hover:border-gold-dark transition-colors duration-300 h-full">
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
                </TiltCard3D>
              </Link>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-20 px-8 max-w-7xl mx-auto border-t border-black-3">
        <Reviews productId="all" productName="Orygin" />
      </section>

      {/* MANIFESTO QUOTE */}
      <Reveal3D rotateX={10} translateY={50}>
        <section className="py-24 px-8 border-t border-black-3 text-center relative overflow-hidden">
          <Scene3D count={15} className="opacity-40" />
          <OryginStar size={28} className="mx-auto mb-8 opacity-40 animate-shimmer relative z-10" />
          <p className="text-[8px] tracking-[5px] text-gold-dark mb-6 relative z-10">MANIFESTO</p>
          <blockquote className="font-cormorant italic text-4xl md:text-5xl text-white max-w-2xl mx-auto leading-tight mb-6 relative z-10">
            "Chaque culture a une origine.<br />Chaque origine a un style."
          </blockquote>
          <div className="w-8 h-px bg-gold-dark/30 mx-auto mb-4 relative z-10" />
          <p className="text-[8px] tracking-[5px] text-gold-dark relative z-10">
            — ORYGIN · GLOBAL STREET CULTURE
          </p>
        </section>
      </Reveal3D>
    </div>
  );
}
