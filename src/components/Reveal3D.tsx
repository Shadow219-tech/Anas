import { useRef, useEffect, useState, type ReactNode } from 'react';

interface Reveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number; // seconds
  threshold?: number; // 0-1 visibility ratio
  rotateX?: number; // initial X rotation
  translateY?: number; // initial Y offset
  once?: boolean;
}

/**
 * Scroll-triggered 3D entrance — element flies in from below with perspective rotation.
 */
export default function Reveal3D({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  rotateX = 15,
  translateY = 40,
  once = true,
}: Reveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={`reveal3d ${revealed ? 'revealed' : ''} ${className}`}
      style={{
        animationDelay: `${delay}s`,
        ['--rx' as string]: `${rotateX}deg`,
        ['--ty' as string]: `${translateY}px`,
        transform: revealed
          ? undefined
          : `perspective(800px) rotateX(${rotateX}deg) translateY(${translateY}px) scale(0.95)`,
      }}
    >
      {children}
    </div>
  );
}
