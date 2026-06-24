import { Link } from 'react-router-dom';
import OryginStar from './OryginStar';

export default function Footer() {
  return (
    <footer className="border-t border-black-3 bg-black-2">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <OryginStar size={24} />
              <span className="font-cormorant italic text-2xl text-gold-gradient">Orygin</span>
            </div>
            <p className="text-[10px] tracking-[4px] text-gray-1 mb-4">GLOBAL STREET CULTURE</p>
            <p className="text-xs text-gray-3 leading-loose max-w-xs">
              Chaque culture a une origine. Chaque origine a un style.
            </p>
          </div>

          <div>
            <p className="text-[8px] tracking-[4px] text-gold-dark mb-5">CONTINENTS</p>
            <div className="space-y-3">
              {[
                { to: '/afrique', label: 'Afrique' },
                { to: '/asie', label: 'Asie' },
                { to: '/ameriques', label: 'Amériques' },
                { to: '/europe', label: 'Europe' },
                { to: '/oceanie', label: 'Océanie' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="block text-xs text-gray-3 hover:text-gold transition-colors font-cormorant italic">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] tracking-[4px] text-gold-dark mb-5">ORYGIN</p>
            <div className="space-y-3">
              {[
                { to: '/histoire', label: 'Notre Histoire' },
                { to: '/', label: 'Drop 001' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="block text-xs text-gray-3 hover:text-gold transition-colors font-cormorant italic">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black-3 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[8px] tracking-[3px] text-gray-2">
            © 2025 ORYGIN · GLOBAL STREET CULTURE
          </p>
          <p className="text-[8px] tracking-[3px] text-gray-2">
            LIVRAISON MONDIALE · PIÈCES LIMITÉES
          </p>
        </div>
      </div>
    </footer>
  );
}
