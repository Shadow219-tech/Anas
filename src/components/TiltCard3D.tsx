import { useRef, useState, type ReactNode } from 'react';

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // max rotation in degrees
  glare?: boolean;
  glareColor?: string;
}

/**
 * Mouse-tracking 3D perspective tilt card with optional glare highlight.
 * Uses perspective on the parent and rotateX/Y on hover — no preserve-3d
 * on children (which breaks with overflow:hidden).
 */
export default function TiltCard3D({
  children,
  className = '',
  intensity = 12,
  glare = true,
  glareColor = 'rgba(201,168,76,0.15)',
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, active: false });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 2;  // -1 to 1
    const py = (y / rect.height - 0.5) * 2;
    const rotY = px * intensity;
    const rotX = -py * intensity;
    setTransform(
      `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`
    );
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, active: true });
  };

  const handleLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
    setGlarePos(g => ({ ...g, active: false }));
  };

  return (
    <div
      ref={ref}
      className={`tilt-3d ${className}`}
      style={{ transform }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="tilt-3d-inner">
        {children}
        {glare && (
          <div
            className={`tilt-3d-glare ${glarePos.active ? 'active' : ''}`}
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor} 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
