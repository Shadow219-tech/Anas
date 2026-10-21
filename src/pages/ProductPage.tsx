import { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { COUNTRIES, findProductById } from '../data/countries';
import { useCart } from '../context/CartContext';
import OryginStar from '../components/OryginStar';
import Reviews from '../components/Reviews';

const continentLabel: Record<string, string> = {
  afrique: 'Afrique', asie: 'Asie', ameriques: 'Amériques',
  europe: 'Europe', oceanie: 'Océanie',
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const found = slug ? findProductById(slug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
  }, [slug]);

  if (!found) return <Navigate to="/" replace />;

  const { product, countryCode, countryName } = found;
  const country = COUNTRIES.find(c => c.code === countryCode);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, countryCode, countryName);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const prev = () => setActiveImg(i => (i - 1 + product.images.length) % product.images.length);
  const next = () => setActiveImg(i => (i + 1) % product.images.length);

  const backLink = country ? `/pays/${country.code.toLowerCase()}` : '/';

  return (
    <div className="min-h-screen bg-black-1 pt-16">
      <div className="border-b border-black-3">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[8px] tracking-[3px]">
            <Link to="/" className="text-gray-1/70 hover:text-gold transition-colors">ACCUEIL</Link>
            <span className="text-gray-2/50">·</span>
            {country && (
              <>
                <Link to={`/${country.continent}`} className="text-gray-1/70 hover:text-gold transition-colors">
                  {(continentLabel[country.continent] ?? country.continent).toUpperCase()}
                </Link>
                <span className="text-gray-2/50">·</span>
                <Link to={backLink} className="text-gray-1/70 hover:text-gold transition-colors">
                  {countryName.toUpperCase()}
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[9px] tracking-[3px] text-gray-3 hover:text-gold transition-colors"
          >
            <ArrowLeft size={12} />
            RETOUR
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left — image gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-black-3">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    i === activeImg ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                  style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black-1/20 to-transparent pointer-events-none" />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black-1/70 backdrop-blur-sm p-2 text-gray-3 hover:text-gold transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black-1/70 backdrop-blur-sm p-2 text-gray-3 hover:text-gold transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="absolute top-4 left-4">
                <span className="text-[8px] tracking-[3px] text-gold-dark bg-black-1/85 px-3 py-1.5 backdrop-blur-sm border border-black-3">
                  ENSEMBLE
                </span>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 overflow-hidden border-2 transition-all duration-200 ${
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
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <OryginStar size={14} />
              <span className="text-[8px] tracking-[4px] text-gold-dark">
                {countryName.toUpperCase()} · DROP 001
              </span>
            </div>

            <h1 className="font-cormorant italic text-4xl md:text-5xl text-white leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-8">
              <span
                className="font-cormorant italic text-3xl"
                style={{ background: 'linear-gradient(135deg, #ede0b8 0%, #c9a84c 50%, #f0e0a0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {product.price} €
              </span>
              <span className="text-[8px] tracking-[3px] text-gray-2">TTC · LIVRAISON OFFERTE</span>
            </div>

            <p className="text-sm text-gray-3 leading-loose mb-6 border-t border-black-3 pt-6">
              {product.description}
            </p>

            <div className="mb-6">
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-2">HISTOIRE</p>
              <p className="text-sm text-gray-3 leading-relaxed italic">{product.story}</p>
            </div>

            <div className="mb-8">
              <p className="text-[8px] tracking-[4px] text-gold-dark mb-2">MATIÈRE</p>
              <p className="text-[10px] tracking-[2px] text-gray-2">{product.fabric}</p>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-1 bg-black-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-dark to-gold" style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }} />
              </div>
              <span className="text-[8px] tracking-[2px] text-gray-2">{product.stock} EN STOCK</span>
            </div>

            <div className="mt-auto space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] tracking-[4px] text-gold-dark">TAILLE</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map(size => (
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

              <div className="flex justify-between pt-4 border-t border-black-3">
                {['PIÈCE LIMITÉE', 'LIVRAISON OFFERTE', 'RETOUR GRATUIT'].map(t => (
                  <span key={t} className="text-[7px] tracking-[2px] text-gray-2 text-center">{t}</span>
                ))}
              </div>
            </div>

            <Link
              to={backLink}
              className="mt-8 flex items-center gap-2 text-[9px] tracking-[3px] text-gray-3 hover:text-gold transition-colors"
            >
              <ArrowLeft size={12} />
              RETOUR À {countryName.toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <Reviews productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
