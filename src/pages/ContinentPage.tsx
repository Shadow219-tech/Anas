import { Link, useParams, Navigate } from 'react-router-dom';
import { CONTINENTS, COUNTRIES, PRODUCTS_BY_COUNTRY } from '../data/countries';
import OryginStar from '../components/OryginStar';
import Scene3D from '../components/Scene3D';
import TiltCard3D from '../components/TiltCard3D';
import Reveal3D from '../components/Reveal3D';

export default function ContinentPage() {
  const { continent: slug } = useParams<{ continent: string }>();
  const continent = CONTINENTS.find(item => item.id === slug);

  if (!continent) return <Navigate to="/" replace />;

  const countries = COUNTRIES.filter(country => country.continent === continent.id);
  const available = countries.filter(country => country.status === 'available');
  const coming = countries.filter(country => country.status === 'soon');

  return (
    <div className="min-h-screen bg-black-1 pt-16 page3d-in">
      <header className="relative overflow-hidden border-b border-black-3 py-20 px-8 text-center">
        <Scene3D count={28} className="opacity-40" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-5">
          <OryginStar size={300} />
        </div>
        <div className="relative z-10">
          <p className="text-[9px] tracking-[5px] text-gold-dark mb-4">{continent.emoji} · ORYGIN</p>
          <h1 className="font-cormorant italic text-7xl md:text-[120px] text-gold-gradient leading-none mb-5">
            {continent.name}
          </h1>
          <p className="text-[10px] tracking-[5px] text-gray-1">
            {continent.countryCount > 0 ? `${continent.countryCount} PAYS · ` : ''}UNE ORIGINE, UN STYLE
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {available.length > 0 && (
          <section className="mb-20">
            <Reveal3D>
              <div className="flex items-center gap-4 mb-10">
                <OryginStar size={15} />
                <span className="text-[9px] tracking-[5px] text-gold-dark">PAYS DISPONIBLES</span>
              </div>
            </Reveal3D>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {available.map((country, index) => {
                const product = PRODUCTS_BY_COUNTRY[country.code]?.[0];
                const image = country.heroImage ?? product?.images[0];
                return (
                  <Reveal3D key={country.code} delay={index * 0.1} rotateX={14} translateY={45}>
                    <Link to={`/pays/${country.code.toLowerCase()}`} className="block group">
                      <TiltCard3D intensity={12} className="relative overflow-hidden aspect-[3/4] shadow3d">
                        {image && <img src={image} alt={country.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ filter: 'brightness(0.82) contrast(1.08) saturate(1.08)' }} />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black-1 via-black-1/30 to-transparent" />
                        <div className="absolute top-5 left-5">
                          <span className="text-[8px] tracking-[3px] text-gold border border-gold-dark/50 px-3 py-2 bg-black-1/60 backdrop-blur-sm">✦ DISPONIBLE</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-[9px] tracking-[4px] text-gray-3 mb-2">{country.code}</p>
                          <h2 className="font-cormorant italic text-3xl text-white group-hover:text-gold transition-colors">{country.name}</h2>
                          <p className="text-[10px] tracking-[1px] text-gray-3 italic mt-2">{country.subtitle}</p>
                        </div>
                      </TiltCard3D>
                    </Link>
                  </Reveal3D>
                );
              })}
            </div>
          </section>
        )}

        {coming.length > 0 ? (
          <section>
            <Reveal3D>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1 h-1 bg-gray-2 rotate-45" />
                <span className="text-[9px] tracking-[5px] text-gray-2">COLLECTIONS À VENIR</span>
              </div>
            </Reveal3D>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coming.map((country, index) => (
                <Reveal3D key={country.code} delay={index * 0.08} rotateX={12} translateY={30}>
                  <Link to={`/pays/${country.code.toLowerCase()}`} className="block group">
                    <TiltCard3D intensity={10} className="relative overflow-hidden aspect-[3/4] border border-black-3/70">
                      {country.heroImage && <img src={country.heroImage} alt={country.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-35 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black-1 via-black-1/65 to-black-1/20" />
                      <div className="absolute top-5 left-5">
                        <span className="text-[8px] tracking-[3px] text-gray-2 border border-gray-2/30 px-3 py-2 bg-black-1/60 backdrop-blur-sm">— BIENTÔT</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-[9px] tracking-[4px] text-gray-2 mb-2">{country.code}</p>
                        <h2 className="font-cormorant italic text-3xl text-gray-3 group-hover:text-white transition-colors">{country.name}</h2>
                        <p className="text-[10px] tracking-[1px] text-gray-2 italic mt-2">{country.subtitle}</p>
                      </div>
                    </TiltCard3D>
                  </Link>
                </Reveal3D>
              ))}
            </div>
          </section>
        ) : (
          <div className="py-20 text-center border-t border-black-3">
            <OryginStar size={28} className="mx-auto mb-6 opacity-30" />
            <p className="text-[9px] tracking-[5px] text-gray-2">PROCHAINEMENT</p>
            <p className="font-cormorant italic text-2xl text-gray-3 mt-3">De nouvelles origines arrivent bientôt.</p>
          </div>
        )}
      </main>
    </div>
  );
}
