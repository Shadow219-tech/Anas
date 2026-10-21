import { useParams, Navigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { COUNTRIES, PRODUCTS_BY_COUNTRY } from '../data/countries';
import OryginStar from '../components/OryginStar';
import Scene3D from '../components/Scene3D';
import TiltCard3D from '../components/TiltCard3D';
import Reveal3D from '../components/Reveal3D';
import Reviews from '../components/Reviews';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const continentLabel: Record<string, string> = {
  afrique: 'Afrique', asie: 'Asie', ameriques: 'Amériques',
  europe: 'Europe', oceanie: 'Océanie',
};

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [code]);

  const country = COUNTRIES.find(c => c.code.toLowerCase() === code?.toLowerCase());
  if (!country) return <Navigate to="/" replace />;

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

  const jacket = PRODUCTS_BY_COUNTRY[country.code]?.[0];
  if (!jacket) return <Navigate to="/" replace />;

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(jacket, selectedSize, country.code, country.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black-1 pt-16 page3d-in">
      {/* HERO */}
      <div
        className="relative h-[80svh] flex flex-col items-center justify-center overflow-hidden"
        style={country.heroImage ? {
          backgroundImage: `url(${country.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        } : { background: '#0d0d0d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black-1/30 via-black-1/50 to-black-1" />
        <Scene3D count={35} className="opacity-40" />

        <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <Link to="/" className="text-[8px] tracking-[3px] text-gray-1/70 hover:text-gold transition-colors">ACCUEIL</Link>
          <span className="text-gray-2/50 text-[8px]">·</span>
          <Link to={`/${country.continent}`} className="text-[8px] tracking-[3px] text-gray-1/70 hover:text-gold transition-colors">
            {(continentLabel[country.continent] ?? country.continent).toUpperCase()}
          </Link>
          <span className="text-gray-2/50 text-[8px]">·</span>
          <span className="text-[8px] tracking-[3px] text-gold/80">{country.name.toUpperCase()}</span>
        </div>

        <div className="relative z-10 text-center px-8">
          <p className="text-[9px] tracking-[6px] text-gold-dark mb-4 animate-fade-in-up">{country.code}</p>
          <h1
            className="font-cormorant italic leading-none mb-4 animate-fade-in-up animate-delay-100"
            style={{
              fontSize: 'clamp(60px, 12vw, 140px)',
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
      </div>

      {/* JACKET SECTION */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <Reveal3D>
          <div className="flex items-center gap-4 mb-12">
            <OryginStar size={16} />
            <span className="text-[9px] tracking-[5px] text-gold-dark">LA VESTE — {country.code}</span>
          </div>
        </Reveal3D>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left — image */}
          <Reveal3D delay={0.1} rotateX={15} translateY={50}>
            <TiltCard3D intensity={10} className="relative overflow-hidden aspect-[3/4] bg-black-3 shadow3d">
              <img
                src={jacket.images[0]}
                alt={jacket.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-1/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[8px] tracking-[3px] text-gold-dark bg-black-1/85 px-3 py-1.5 backdrop-blur-sm border border-black-3">
                  VESTE
                </span>
              </div>
            </TiltCard3D>
          </Reveal3D>

          {/* Right — info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <OryginStar size={14} />
              <span className="text-[8px] tracking-[4px] text-gold-dark">
                {country.name.toUpperCase()} · DROP 001
              </span>
            </div>

            <h2 className="font-cormorant italic text-4xl md:text-5xl text-white leading-tight mb-4">
              {jacket.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-8">
              <span
                className="font-cormorant italic text-3xl"
                style={{ background: 'linear-gradient(135deg, #ede0b8 0%, #c9a84c 50%, #f0e0a0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {jacket.price} €
              </span>
              <span className="text-[8px] tracking-[3px] text-gray-2">TTC · LIVRAISON OFFERTE</span>
            </div>

            <p className="text-sm text-gray-3 leading-loose mb-6 border-t border-black-3 pt-6">
              {jacket.description}
            </p>

            <div className="mb-6">
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-2">HISTOIRE</p>
              <p className="text-sm text-gray-3 leading-relaxed italic">{jacket.story}</p>
            </div>

            <div className="mb-8">
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-2">MATIÈRE</p>
              <p className="text-[10px] tracking-[2px] text-gray-2">{jacket.fabric}</p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-1 bg-black-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-dark to-gold" style={{ width: `${Math.min((jacket.stock / 50) * 100, 100)}%` }} />
              </div>
              <span className="text-[8px] tracking-[2px] text-gray-2">{jacket.stock} EN STOCK</span>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] tracking-[4px] text-gold-dark">TAILLE</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {jacket.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-[9px] tracking-[1px] border transition-all duration-200 ${
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
                <><Check size={14} />AJOUTÉ AU PANIER</>
              ) : (
                <><ShoppingBag size={14} />{selectedSize ? 'AJOUTER AU PANIER' : 'CHOISIR UNE TAILLE'}</>
              )}
            </button>

            <div className="flex justify-between pt-4 border-t border-black-3 mt-6">
              {['PIÈCE LIMITÉE', 'LIVRAISON OFFERTE', 'RETOUR GRATUIT'].map(t => (
                <span key={t} className="text-[7px] tracking-[2px] text-gray-2 text-center">{t}</span>
              ))}
            </div>

            <Link
              to={`/${country.continent}`}
              className="mt-8 flex items-center gap-2 text-[9px] tracking-[3px] text-gray-3 hover:text-gold transition-colors"
            >
              <ArrowLeft size={12} />
              RETOUR À {(continentLabel[country.continent] ?? country.continent).toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <Reviews productId={jacket.id} productName={jacket.name} />
        </div>
      </div>
    </div>
  );
}
