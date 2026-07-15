interface Star3DProps {
  size?: number;
  className?: string;
}

/**
 * Full 3D animated Orygin star — multi-layer extrusion, Y-axis rotation,
 * dynamic glow, orbiting particles, and pulsing rings.
 */
export default function Star3D({ size = 160, className = '' }: Star3DProps) {
  // Extrusion layers — each SVG copy is offset along Z for 3D depth
  const layers = 22;
  const depthStep = 2.2; // px between layers

  // Orbiting particles config
  const particles = Array.from({ length: 6 }, (_, i) => ({
    r: 52 + (i % 3) * 18,
    d: 6 + (i % 3) * 3,
    delay: (i * 1.2) % 8,
    color: i % 2 === 0 ? '#c9a84c' : '#f0e0a0',
    size: i % 3 === 0 ? 5 : 3,
  }));

  // Rings config
  const rings = [
    { size: 1.35, opacity: 0.12, duration: 8 },
    { size: 1.6, opacity: 0.08, duration: 10 },
  ];

  const StarSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 80 80">
      <defs>
        <linearGradient id="s3d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ede0b8" />
          <stop offset="35%" stopColor="#c9a84c" />
          <stop offset="65%" stopColor="#f0e0a0" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>
      </defs>
      <g transform="translate(40,40)">
        <path d="M0,-34 C3,-22 5,-13 4,-8 C2,-3 1,-1 0,0 C-1,-1 -2,-3 -4,-8 C-5,-13 -3,-22 0,-34 Z" fill="url(#s3d-grad)" />
        <path d="M0,34 C3,22 5,13 4,8 C2,3 1,1 0,0 C-1,1 -2,3 -4,8 C-5,13 -3,22 0,34 Z" fill="url(#s3d-grad)" />
        <path d="M-34,0 C-22,3 -13,5 -8,4 C-3,2 -1,1 0,0 C-1,-1 -3,-2 -8,-4 C-13,-5 -22,-3 -34,0 Z" fill="url(#s3d-grad)" />
        <path d="M34,0 C22,3 13,5 8,4 C3,2 1,1 0,0 C1,-1 3,-2 8,-4 C13,-5 22,-3 34,0 Z" fill="url(#s3d-grad)" />
        <circle cx="0" cy="0" r="3.5" fill="url(#s3d-grad)" />
        <circle cx="0" cy="0" r="1.4" fill="#080808" />
      </g>
    </svg>
  );

  return (
    <div
      className={`star3d-scene relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow behind star */}
      <div
        className="star3d-ambient pointer-events-none"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Pulsing rings */}
      {rings.map((ring, i) => (
        <div
          key={`ring-${i}`}
          className="star3d-ring pointer-events-none"
          style={{
            width: size * ring.size,
            height: size * ring.size,
            margin: 'auto',
            inset: 0,
            border: `0.5px solid rgba(201,168,76,${ring.opacity})`,
            animationDuration: `${ring.duration}s`,
          }}
        />
      ))}

      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <div
          key={`orbit-${i}`}
          className="star3d-orbit-particle pointer-events-none"
          style={{
            background: p.color,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 6px ${p.color}, 0 0 12px ${p.color}88`,
            ['--orbit-r' as string]: `${p.r}px`,
            ['--orbit-d' as string]: `${p.d}s`,
            ['--orbit-delay' as string]: `${p.delay}s`,
          }}
        />
      ))}

      {/* 3D extruded star */}
      <div className="star3d-inner absolute inset-0">
        {/* Extrusion layers (back to front) */}
        {Array.from({ length: layers }, (_, i) => {
          const z = (layers - 1 - i) * depthStep;
          const opacity = 0.15 + (i / layers) * 0.85;
          const scale = 1 - (layers - 1 - i) * 0.004;
          return (
            <div
              key={`layer-${i}`}
              className="star3d-layer"
              style={{
                ['--z' as string]: `${z}px`,
                opacity: i === layers - 1 ? 1 : opacity * 0.5,
                transform: `translateZ(${z}px) scale(${scale})`,
                animationDelay: `${i * 0.04}s`,
              }}
            >
              <StarSVG />
            </div>
          );
        })}
      </div>
    </div>
  );
}
