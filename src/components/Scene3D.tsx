import { useMemo } from 'react';

interface Scene3DProps {
  count?: number;
  className?: string;
  color?: string;
}

/**
 * Floating 3D particle field background — gold dust drifting in perspective space.
 * Pure CSS animations, no external libs.
 */
export default function Scene3D({
  count = 40,
  className = '',
  color = '#c9a84c',
}: Scene3DProps) {
  const particles = useMemo(() => {
    const animations = ['float3d-1', 'float3d-2', 'float3d-3', 'drift3d'];
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 4;
      return {
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        opacity: 0.1 + Math.random() * 0.5,
        duration: 8 + Math.random() * 16,
        delay: Math.random() * 10,
        animation: animations[i % animations.length],
        dx: `${(Math.random() - 0.5) * 60}px`,
        dy: `${(Math.random() - 0.5) * 60}px`,
        dz: `${Math.random() * 120}px`,
        glow: Math.random() > 0.6,
        twinkle: Math.random() > 0.7,
      };
    });
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="scene3d-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: p.opacity,
            boxShadow: p.glow ? `0 0 ${p.size * 3}px ${color}, 0 0 ${p.size * 6}px ${color}66` : 'none',
            animation: `${p.animation} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            ['--dx' as string]: p.dx,
            ['--dy' as string]: p.dy,
            ['--dz' as string]: p.dz,
          }}
        >
          {p.twinkle && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: color,
                animation: `twinkle3d ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
