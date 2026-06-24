import OryginStar from '../components/OryginStar';

export default function HistoirePage() {
  return (
    <div className="min-h-screen bg-black-1 pt-16">
      <div className="max-w-3xl mx-auto px-8 py-24">
        <div className="text-center mb-20">
          <OryginStar size={60} className="mx-auto mb-8 animate-float" animated />
          <p className="text-[9px] tracking-[6px] text-gold-dark mb-4">NOTRE HISTOIRE</p>
          <h1 className="font-cormorant italic text-7xl text-gold-gradient mb-6">Manifesto</h1>
          <div className="w-16 h-px bg-gold-dark/30 mx-auto" />
        </div>

        <div className="space-y-12 text-center">
          <blockquote className="font-cormorant italic text-3xl text-white leading-relaxed">
            "Chaque culture a une origine.<br />Chaque origine a un style."
          </blockquote>

          <div className="border-t border-black-3 pt-12 space-y-6">
            <p className="text-sm text-gray-3 leading-loose tracking-wide">
              Orygin est née d'une conviction simple — la mode la plus authentique
              puise ses racines dans les cultures du monde. Pas dans les tendances,
              pas dans le marketing. Dans les couleurs d'un marché de Marrakech,
              dans l'indigo d'un atelier de Kyoto, dans l'asphalte de Brooklyn.
            </p>
            <p className="text-sm text-gray-3 leading-loose tracking-wide">
              Chaque collection est un voyage. Chaque pièce raconte une histoire.
              L'étoile à quatre branches — notre logo — représente les quatre coins
              du monde, les quatre origines qui fondent le Drop 001.
            </p>
            <p className="text-sm text-gray-3 leading-loose tracking-wide">
              Orygin est unisexe, universelle. Elle n'appartient pas à un genre,
              pas à une tribu. Elle appartient à ceux qui savent d'où ils viennent
              et savent où ils vont.
            </p>
          </div>

          <div className="border-t border-black-3 pt-12">
            <p className="text-[8px] tracking-[6px] text-gold-dark">
              ORYGIN · GLOBAL STREET CULTURE · DROP 001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
