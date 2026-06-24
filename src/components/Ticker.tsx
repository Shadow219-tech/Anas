export default function Ticker() {
  const items = [
    '✦ GLOBAL STREET CULTURE',
    '✦ DROP 001 DISPONIBLE',
    '✦ LIVRAISON MONDIALE',
    '✦ PIÈCES LIMITÉES',
    '✦ 5 CONTINENTS',
    '✦ UNISEXE',
    '✦ QUATRE ORIGINES',
    '✦ ÉDITION LIMITÉE',
  ];

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden bg-black-2 border-y border-black-3 py-3">
      <div className="animate-ticker flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[9px] tracking-[4px] text-gold-dark mx-8 flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
