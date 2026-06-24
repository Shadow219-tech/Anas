import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: 'JOURS', value: time.days },
    { label: 'HEURES', value: time.hours },
    { label: 'MINUTES', value: time.minutes },
    { label: 'SECONDES', value: time.seconds },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="border border-black-3 px-6 py-5 text-center min-w-[90px]"
        >
          <div className="font-cormorant italic text-4xl text-gold leading-none mb-2">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[8px] tracking-[3px] text-gray-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
