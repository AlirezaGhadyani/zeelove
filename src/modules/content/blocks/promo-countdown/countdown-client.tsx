'use client';

import { useEffect, useState } from 'react';

interface CountdownClientProps {
  targetEndDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownClient({ targetEndDate }: CountdownClientProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetEndDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetEndDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetEndDate]);

  const units = [
    { label: 'روز', value: timeLeft.days },
    { label: 'ساعت', value: timeLeft.hours },
    { label: 'دقیقه', value: timeLeft.minutes },
    { label: 'ثانیه', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {units.map((u, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm border border-white/20 min-w-[56px] sm:min-w-[70px]"
        >
          <span className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
            {u.value.toString().padStart(2, '۰')}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-300 font-medium mt-0.5">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
