import { useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { COUNTRIES, PRODUCTS_BY_COUNTRY } from '../data/countries';
import type { Product } from '../data/countries';
import OryginStar from '../components/OryginStar';
import TiltCard3D from '../components/TiltCard3D';
import Reveal3D from '../components/Reveal3D';
import Scene3D from '../components/Scene3D';

type SeasonFilter = 'ete' | 'hiver';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  tshirt: 'T-SHIRT',
  short: 'SHORT',
  'ensemble-ete': 'ENSEMBLE ÉTÉ',
  hoodie: 'HOODIE',
  cargo: 'CARGO',
  'ensemble-hiver': 'ENSEMBLE HIVER',
};

// ── Product Grid Card ─────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const isUnavailable = product.availability === 'unavailable';

  return (
    <Link
      to={`/produit/${product.id}`}
      className={`group block transition-all duration-300 ${isUnavailable ? 'opacity-50' : ''}`}
    >
      <TiltCard3D intensity={10} className="relative overflow-hidden aspect-[3/4] bg-black-3 mb-4 shadow3d">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          style={{
            filter: isUnavailable
              ? 'grayscale(1) brightness(0.5)'
              : 'brightness(1.05) contrast(1.05) saturate(1.12)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-1/60 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[7px] tracking-[3px] bg-black-1/90 text-gold-dark px-2.5 py-1 backdrop-blur-sm border border-black-3/60">
            {PRODUCT_TYPE_LABELS[product.type]}
          </span>
        </div>

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black-1/70 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
              <Lock size={10} className="text-gray-2" />
              <span className="text-[8px] tracking-[3px] text-gray-2">BIENTÔT</span>
            </div>
          </div>
        )}

        {/* Quick view hint */}
        {!isUnavailable && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-[8px] tracking-[4px] text-white bg-black-1/80 backdrop-blur-sm px-4 py-2 border border-black-3">
              VOIR LE PRODUIT
            </span>
          </div>
        )}
      </TiltCard3D>

      {/* Info */}
      <div>
        <div className="font-cormorant italic text-lg text-white leading-tight mb-0.5 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </div>
        <div
          className="font-cormorant italic text-base"
          style={{ background: 'linear-gradient(135deg, #c9a84c, #f0e0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {product.price} €
        </div>
      </div>
    </Link>
  );
}

// ── Main Country Page ─────────────────────────────────────────────────────────
export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const [season, setSeason] = useState<SeasonFilter>('ete');
  const productsRef = useRef<HTMLDivElement>(null);

  const country = COUNTRIES.find(c => c.code.toLowerCase() === code?.toLowerCase());
  if (!country) return <Navigate to="/" replace />;

  const continentLabel: Record<string, string> = {
    afrique: 'Afrique', asie: 'Asie', ameriques: 'Amériques',
    europe: 'Europe', oceanie: 'Océanie',
  };

  if (country.status === 'soon') {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex flex-col items-center justify-center text-center px-8 page3d-in">
        <Scene3D count={30} className="opacity-50" />
        <div className="animate-float mb-8 text-8xl relative z-10">{country.flag}</div>
        <h1 className="font-cormorant italic text-7xl text-gold-gradient mb-4 relative z-10">{country.name}</h1>
        <p className="text-[10px] tracking-[4px] text-gray-1 mb-2 relative z-10">{country.subtitle}</p>
        <p className="text-[9px] tracking-[4px] text-gray-2 mb-12 relative z-10">— BIENTÔT DISPONIBLE</p>
        <Link
          to={`/${country.continent}`}
          className="text-[9px] tracking-[4px] text-gold-dark border border-gold-dark/40 px-6 py-3 hover:bg-gold-dark/10 transition-colors relative z-10"
        >
          ← RETOUR {(continentLabel[country.continent] ?? country.continent).toUpperCase()}
        </Link>
      </div>
    );
  }

  const allProducts = PRODUCTS_BY_COUNTRY[country.code] ?? [];
  const filtered = allProducts.filter(p => p.season === season);
  const eteCount = allProducts.filter(p => p.season === 'ete' && p.availability === 'available').length;
  const hiverCount = allProducts.filter(p => p.season === 'hiver' && p.availability === 'available').length;

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-black-1 pt-16 page3d-in">
      {/* HERO — full screen */}
      <div
        className="relative h-[100svh] flex flex-col items-center justify-center overflow-hidden"
        style={country.heroImage ? {
          backgroundImage: `url(${country.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        } : { background: '#0d0d0d' }}
      >
        {/* Layered overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black-1/30 via-black-1/50 to-black-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-black-1/80 via-transparent to-transparent" />
        <Scene3D count={35} className="opacity-40" />

        {/* Breadcrumb */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <Link to="/" className="text-[8px] tracking-[3px] text-gray-1/70 hover:text-gold transition-colors">ACCUEIL</Link>
          <span className="text-gray-2/50 text-[8px]">·</span>
          <Link to={`/${country.continent}`} className="text-[8px] tracking-[3px] text-gray-1/70 hover:text-gold transition-colors">
            {(continentLabel[country.continent] ?? country.continent).toUpperCase()}
          </Link>
          <span className="text-gray-2/50 text-[8px]">·</span>
          <span className="text-[8px] tracking-[3px] text-gold/80">{country.name.toUpperCase()}</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-8">
          <p className="text-[9px] tracking-[6px] text-gold-dark mb-4 animate-fade-in-up">{country.code}</p>
          <h1
            className="font-cormorant italic leading-none mb-4 animate-fade-in-up animate-delay-100"
            style={{
              fontSize: 'clamp(72px, 14vw, 160px)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, #c9a84c 40%, #f0e0a0 65%, rgba(255,255,255,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {country.name}
          </h1>
          <p className="font-cormorant italic text-gray-3 text-xl tracking-wider animate-fade-in-up animate-delay-200">
            {country.subtitle}
          </p>
        </div>

        {/* Scroll CTA */}
        <button
          onClick={scrollToProducts}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 group"
        >
          <span className="text-[8px] tracking-[5px] text-gold-dark group-hover:text-gold transition-colors">
            ✦ LA COLLECTION
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-gold-dark to-transparent animate-shimmer" />
        </button>
      </div>

      {/* COLLECTION SECTION */}
      <div ref={productsRef} className="max-w-7xl mx-auto px-8 pt-20 pb-24">
        {/* Season tabs */}
        <div className="flex justify-center mb-16">
          <div className="flex border border-black-3 relative overflow-hidden">
            {/* Animated active bg */}
            <div
              className="absolute top-0 bottom-0 w-1/2 bg-gold/10 border-r border-gold-dark/30 transition-all duration-300"
              style={{ left: season === 'ete' ? '0%' : '50%' }}
            />
            {(['ete', 'hiver'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`relative z-10 px-12 py-4 text-[9px] tracking-[5px] transition-all duration-300 ${
                  season === s ? 'text-gold' : 'text-gray-2 hover:text-white'
                }`}
              >
                {s === 'ete' ? 'ÉTÉ' : 'HIVER'}
                {s === 'ete' && eteCount > 0 && (
                  <span className="ml-2 text-[7px] text-gold-dark">✦</span>
                )}
                {s === 'hiver' && hiverCount === 0 && (
                  <span className="ml-2 text-[7px] text-gray-2">—</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((product, i) => (
              <Reveal3D key={product.id} delay={i * 0.1} rotateX={15} translateY={50}>
                <ProductCard product={product} />
              </Reveal3D>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <OryginStar size={40} className="mx-auto mb-6 opacity-20 animate-float" />
            <p className="font-cormorant italic text-2xl text-gray-3 mb-2">Collection Hiver</p>
            <p className="text-[9px] tracking-[4px] text-gray-2">DROP 002 — BIENTÔT</p>
          </div>
        )}
      </div>
    </div>
  );
}
