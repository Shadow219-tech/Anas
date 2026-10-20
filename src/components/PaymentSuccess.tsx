import { useState, useEffect, useMemo } from 'react';
import OryginStar from './OryginStar';

export default function PaymentSuccess({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<'star' | 'explode' | 'message'>('star');
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (prefersReduced) {
      setPhase('message');
      return;
    }
    const t1 = setTimeout(() => setPhase('explode'), 1100);
    const t2 = setTimeout(() => setPhase('message'), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [prefersReduced]);

  const particles = useMemo(
    () => Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const dist = 120 + Math.random() * 180;
      return {
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
        delay: Math.random() * 0.2,
        size: 4 + Math.random() * 6,
      };
    }),
    [],
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black-1 pointer-events-none">
      {phase === 'star' && (
        <div className="star-burst-appear" style={{ filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.6))' }}>
          <OryginStar size={120} />
        </div>
      )}

      {phase === 'explode' && (
        <>
          <div className="star-burst-explode absolute" style={{ filter: 'drop-shadow(0 0 60px rgba(201,168,76,0.8))' }}>
            <OryginStar size={120} />
          </div>
          {!prefersReduced && particles.map((p, i) => (
            <div
              key={i}
              className="gold-particle"
              style={{
                ['--px' as string]: `${p.px}px`,
                ['--py' as string]: `${p.py}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </>
      )}

      {phase === 'message' && (
        <div className="thank-you-message text-center px-8 pointer-events-auto">
          <div className="mb-8" style={{ filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.4))' }}>
            <OryginStar size={60} className="mx-auto" />
          </div>
          <h1
            className="font-cormorant italic text-5xl md:text-6xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, #c9a84c 40%, #f0e0a0 70%, rgba(255,255,255,0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Merci de votre visite,
            <br />à la prochaine
          </h1>
          <p className="text-[10px] tracking-[6px] text-gold-dark mt-6">— ORYGIN · GLOBAL STREET CULTURE</p>
          {onDone && (
            <button
              onClick={onDone}
              className="mt-10 px-8 py-3.5 text-[9px] tracking-[5px] transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #c9a84c 0%, #f0e0a0 50%, #c9a84c 100%)',
                color: '#080808',
              }}
            >
              CONTINUER
            </button>
          )}
        </div>
      )}
    </div>
  );
}
