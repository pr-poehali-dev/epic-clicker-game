import { useEffect, useRef, useState } from 'react';

function useOnlineCounter() {
  const [count, setCount] = useState(0);
  const base = useRef(0);

  useEffect(() => {
    base.current = 1200 + Math.floor(Math.random() * 2600);
    setCount(base.current);
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 38) - 15;
      base.current = Math.max(900, Math.min(5000, base.current + delta));
      setCount(base.current);
    }, 2800 + Math.random() * 1400);
    return () => clearInterval(interval);
  }, []);

  return count;
}

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

export default function OnlineBadge() {
  const online = useOnlineCounter();
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: '#22c55e' }} />
        <span className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: '#22c55e' }} />
      </span>
      <span className="font-rajdhani text-xs font-bold tabular-nums transition-all duration-700"
        style={{ color: '#4ade80', minWidth: '2.5rem' }}>
        {online > 0 ? fmt(online) : '—'}
      </span>
      <span className="font-rajdhani text-xs" style={{ color: 'rgba(74,222,128,0.5)' }}>online</span>
    </div>
  );
}
