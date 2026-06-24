import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CONTINENTS, COUNTRIES } from '../data/countries';
import OryginStar from '../components/OryginStar';
import Countdown from '../components/Countdown';

const DROP_DATES: Record<string, Date> = {
  europe: new Date('2026-09-15T00:00:00'),
  oceanie: new Date('2026-12-01T00:00:00'),
};

export default function ContinentPage() {
  const { continent: slug } = useParams<{ continent: string }>();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const continent = CONTINENTS.find(c => c.id === slug);
  if (!continent) return <Navigate to="/" replace />;

  const countries = COUNTRIES.filter(c => c.continent === slug);
  const available = countries.filter(c => c.status === 'available');
  const coming = countries.filter(c => c.status === 'soon');

  const isSoon = continent.status === 'soon';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  if (isSoon) {
    return (
      <div className="min-h-screen bg-black-1 pt-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-8">
          <div className="animate-float mb-8">
            <OryginStar size={100} animated />
          </div>

          <p className="text-[9px] tracking-[6px] text-gold-dark mb-4">
            {continent.dropLabel} —
          </p>
          <h1 className="font-cormorant italic text-7xl md:text-9xl text-gold-gradient mb-4">
            {continent.name}
          </h1>
          <p className="text-[10px] tracking-[5px] text-gray-1 mb-16">
            {continent.countryCount} PAYS · BIENTÔT DISPONIBLE
          </p>

          {DROP_DATES[slug!] && (
            <div className="mb-16">
              <p className="text-[9px] tracking-[5px] text-gray-1 mb-6">LE DROP ARRIVE DANS</p>
              <Countdown targetDate={DROP_DATES[slug!]} />
            </div>
          )}

          {/* Countries preview */}
          {countries.length > 0 && (
            <div className="mb-16 max-w-2xl">
              <p className="text-[9px] tracking-[4px] text-gray-1 mb-6">PAYS À VENIR</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {countries.map(c => (
                  <span key={c.code} className="flex items-center gap-2 border border-black-3 px-4 py-2">
                    <span>{c.flag}</span>
                    <span className="font-cormorant italic text-sm text-gray-3">{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Email */}
          {!sent ? (
            <form onSubmit={submit} className="flex w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="flex-1 bg-black-2 border border-black-3 border-r-0 px-5 py-3.5 text-sm text-white placeholder-gray-1 outline-none"
              />
              <button
                type="submit"
                className="bg-gold text-black-1 px-6 py-3.5 text-[9px] tracking-[4px] hover:bg-gold-light transition-colors"
              >
                ÊTRE NOTIFIÉ
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <OryginStar size={20} />
              <span className="text-[10px] tracking-[4px] text-gold">INSCRIT — À BIENTÔT</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-1 pt-16">
      {/* Header */}
      <div className="py-20 px-8 text-center border-b border-black-3 relative overflow-hidden">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-5">
          <OryginStar size={300} />
        </div>
        <div className="relative z-10">
          <p className="text-[9px] tracking-[5px] text-gold-dark mb-4">
            {continent.emoji} · ORYGIN
          </p>
          <h1 className="font-cormorant italic text-8xl md:text-[120px] text-gold-gradient leading-none mb-4">
            {continent.name}
          </h1>
          <p className="text-[10px] tracking-[5px] text-gray-1">
            {continent.countryCount} PAYS · GLOBAL STREET CULTURE
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Available */}
        {available.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <OryginStar size={14} />
              <span className="text-[9px] tracking-[5px] text-gold">DISPONIBLE</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {available.map(country => (
                <Link
                  key={country.code}
                  to={`/pays/${country.code.toLowerCase()}`}
                  className="group relative border border-black-3 hover:border-gold-dark transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-[10px] tracking-[4px] text-gray-2 mb-1">{country.code}</div>
                        <div className="font-cormorant italic text-3xl text-white group-hover:text-gold transition-colors">
                          {country.name}
                        </div>
                        <div className="text-[9px] tracking-[1px] text-gray-1 italic mt-1">
                          {country.subtitle}
                        </div>
                      </div>
                      <span className="text-2xl">{country.flag}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black-3">
                      <span className="text-[8px] tracking-[3px] text-gold">✦ DISPONIBLE</span>
                      <span className="text-[8px] tracking-[3px] text-gray-1 group-hover:text-gold transition-colors">
                        VOIR →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coming soon */}
        {coming.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-1 bg-gray-2 rotate-45" />
              <span className="text-[9px] tracking-[5px] text-gray-2">BIENTÔT</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {coming.map(country => (
                <div
                  key={country.code}
                  className="border border-black-3/50 p-5 opacity-60"
                >
                  <div className="text-[10px] tracking-[3px] text-gray-2 mb-1">{country.code}</div>
                  <div className="font-cormorant italic text-xl text-gray-3 mb-1">{country.name}</div>
                  <div className="text-[8px] tracking-[1px] text-gray-2 italic mb-3">
                    {country.subtitle}
                  </div>
                  <span className="text-[8px] tracking-[3px] text-gray-2">— BIENTÔT</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
