interface OryginStarProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function OryginStar({ size = 40, className = '', animated = false }: OryginStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`${animated ? 'animate-pulse-star' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="gs-star" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ede0b8" />
          <stop offset="35%" stopColor="#c9a84c" />
          <stop offset="65%" stopColor="#f0e0a0" />
          <stop offset="100%" stopColor="#a07830" />
        </linearGradient>
      </defs>
      <g transform="translate(40,40)">
        <path d="M0,-34 C3,-22 5,-13 4,-8 C2,-3 1,-1 0,0 C-1,-1 -2,-3 -4,-8 C-5,-13 -3,-22 0,-34 Z" fill="url(#gs-star)" />
        <path d="M0,34 C3,22 5,13 4,8 C2,3 1,1 0,0 C-1,1 -2,3 -4,8 C-5,13 -3,22 0,34 Z" fill="url(#gs-star)" />
        <path d="M-34,0 C-22,3 -13,5 -8,4 C-3,2 -1,1 0,0 C-1,-1 -3,-2 -8,-4 C-13,-5 -22,-3 -34,0 Z" fill="url(#gs-star)" />
        <path d="M34,0 C22,3 13,5 8,4 C3,2 1,1 0,0 C1,-1 3,-2 8,-4 C13,-5 22,-3 34,0 Z" fill="url(#gs-star)" />
        <circle cx="0" cy="0" r="3.5" fill="url(#gs-star)" />
        <circle cx="0" cy="0" r="1.4" fill="#080808" />
      </g>
    </svg>
  );
}
