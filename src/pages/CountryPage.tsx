import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Lock, X, ChevronLeft, ChevronRight, Plus, ShoppingBag } from 'lucide-react';
import { COUNTRIES, PRODUCTS_BY_COUNTRY } from '../data/countries';
import type { Product } from '../data/countries';
import { useCart } from '../context/CartContext';
import OryginStar from '../components/OryginStar';

type SeasonFilter = 'ete' | 'hiver';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  tshirt: 'T-SHIRT',
  short: 'SHORT',
  'ensemble-ete': 'ENSEMBLE ÉTÉ',
  hoodie: 'HOODIE',
  cargo: 'CARGO',
  'ensemble-hiver': 'ENSEMBLE HIVER',
};

// ── Product Modal ─────────────────────────────────────────────────────────────
function ProductModal({
  product,
  countryCode,
  countryName,
  onClose,
}: {
  product: Product;
  countryCode: string;
  countryName: string;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const isUnavailable = product.availability === 'unavailable';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleAdd = () => {
    if (!selectedSize || isUnavailable) return;
    addItem({ ...product, image: product.images[0] } as any, selectedSize, countryCode, countryName);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const prev = () => setActiveImg(i => (i - 1 + product.images.length) % product.images.length);
  const next = () => setActiveImg(i => (i + 1) % product.images.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-black-2 border border-black-3 flex flex-col md:flex-row overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(201,168,76,0.08), 0 0 1px rgba(201,168,76,0.15)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-3 hover:text-white transition-colors bg-black-2/80 backdrop-blur-sm p-1.5"
        >
          <X size={18} />
        </button>

        {/* Left — image gallery */}
        <div className="relative w-full md:w-[55%] bg-black-3 flex-shrink-0">
          {/* Main image */}
          <div className="relative aspect-[3/4] md:h-full md:aspect-auto overflow-hidden">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  i === activeImg ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } ${isUnavailable ? 'grayscale' : ''}`}
                style={{ filter: isUnavailable ? 'grayscale(1) brightness(0.6)' : 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black-1/30 to-transparent pointer-events-none" />

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black-1/70 backdrop-blur-sm p-2 text-gray-3 hover:text-gold transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black-1/70 backdrop-blur-sm p-2 text-gray-3 hover:text-gold transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Type badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[8px] tracking-[3px] text-gold-dark bg-black-1/85 px-3 py-1.5 backdrop-blur-sm border border-black-3">
                {PRODUCT_TYPE_LABELS[product.type]}
              </span>
            </div>
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-12 h-14 overflow-hidden border-2 transition-all duration-200 ${
                    i === activeImg ? 'border-gold' : 'border-black-3 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — product info */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          {/* Country / collection */}
          <div className="flex items-center gap-2 mb-6">
            <OryginStar size={14} />
            <span className="text-[8px] tracking-[4px] text-gold-dark">{countryName.toUpperCase()} · DROP 001</span>
          </div>

          <h2 className="font-cormorant italic text-3xl md:text-4xl text-white leading-tight mb-2">
            {product.name}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="font-cormorant italic text-3xl"
              style={{ background: 'linear-gradient(135deg, #ede0b8 0%, #c9a84c 50%, #f0e0a0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {product.price} €
            </span>
            <span className="text-[8px] tracking-[3px] text-gray-2">TTC · LIVRAISON OFFERTE</span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-3 leading-loose mb-6 border-t border-black-3 pt-5">
              {product.description}
            </p>
          )}

          {isUnavailable ? (
            <div className="mt-auto">
              <div className="flex items-center gap-3 border border-black-3 p-4 text-center justify-center">
                <Lock size={14} className="text-gray-2" />
                <span className="text-[9px] tracking-[4px] text-gray-2">{product.unavailableReason}</span>
              </div>
            </div>
          ) : (
            <div className="mt-auto space-y-5">
              {/* Size selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] tracking-[4px] text-gold-dark">TAILLE</span>
                  <button className="text-[8px] tracking-[2px] text-gray-2 underline underline-offset-2 hover:text-white transition-colors">
                    Guide des tailles
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-[9px] tracking-[1px] border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-black-3 text-gray-3 hover:border-gold-dark/50 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className={`w-full py-4 text-[9px] tracking-[5px] transition-all duration-300 flex items-center justify-center gap-3 ${
                  added
                    ? 'bg-gold-dark text-white'
                    : selectedSize
                    ? 'bg-gold text-black-1 hover:bg-gold-light'
                    : 'bg-black-3 text-gray-2 cursor-not-allowed'
                }`}
                style={selectedSize && !added ? { boxShadow: '0 0 30px rgba(201,168,76,0.2)' } : {}}
              >
                {added ? (
                  <>✦ AJOUTÉ AU PANIER</>
                ) : (
                  <><ShoppingBag size={14} />{selectedSize ? 'AJOUTER AU PANIER' : 'CHOISIR UNE TAILLE'}</>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex justify-between pt-4 border-t border-black-3">
                {['PIÈCE LIMITÉE', 'LIVRAISON OFFERTE', 'RETOUR GRATUIT'].map(t => (
                  <span key={t} className="text-[7px] tracking-[2px] text-gray-2 text-center">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Grid Card ─────────────────────────────────────────────────────────
function ProductCard({
  product, onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const isUnavailable = product.availability === 'unavailable';

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ${isUnavailable ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-black-3 mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
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
      </div>

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
    </div>
  );
}

// ── Main Country Page ─────────────────────────────────────────────────────────
export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const [season, setSeason] = useState<SeasonFilter>('ete');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const country = COUNTRIES.find(c => c.code.toLowerCase() === code?.toLowerCase());
  if (!country) return <Navigate to="/" replace />;

  const continentLabel: Record<string, string> = {
    afrique: 'Afrique', asie: 'Asie', ameriques: 'Amériques',
    europe: 'Europe', oceanie: 'Océanie',
  };

  if (country.status === 'soon') {
    return (
      <div className="min-h-screen bg-black-1 pt-16 flex flex-col items-center justify-center text-center px-8">
        <div className="animate-float mb-8 text-8xl">{country.flag}</div>
        <h1 className="font-cormorant italic text-7xl text-gold-gradient mb-4">{country.name}</h1>
        <p className="text-[10px] tracking-[4px] text-gray-1 mb-2">{country.subtitle}</p>
        <p className="text-[9px] tracking-[4px] text-gray-2 mb-12">— BIENTÔT DISPONIBLE</p>
        <Link
          to={`/${country.continent}`}
          className="text-[9px] tracking-[4px] text-gold-dark border border-gold-dark/40 px-6 py-3 hover:bg-gold-dark/10 transition-colors"
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
    <div className="min-h-screen bg-black-1 pt-16">
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
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
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

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          countryCode={country.code}
          countryName={country.name}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
