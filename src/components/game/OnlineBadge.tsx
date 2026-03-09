import { useEffect, useRef, useState } from 'react';

const STATS_URL = 'https://functions.poehali.dev/f7aca427-081b-46fd-9b9c-70ee620ad16b';

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

function useTotalPlayers() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch(STATS_URL)
      .then(r => r.json())
      .then(d => setTotal(d.players))
      .catch(() => {});
  }, []);

  return total;
}

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

export default function OnlineBadge() {
  const online = useOnlineCounter();
  const total = useTotalPlayers();

  return (
    <div className="inline-flex items-center gap-3">
      {/* Online */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#22c55e' }} />
          <span className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: '#22c55e' }} />
        </span>
        <span className="font-rajdhani text-xs font-bold tabular-nums"
          style={{ color: '#4ade80', minWidth: '2.5rem' }}>
          {online > 0 ? fmt(online) : '—'}
        </span>
        <span className="font-rajdhani text-xs" style={{ color: 'rgba(74,222,128,0.5)' }}>online</span>
      </div>

      {/* Total players */}
      {total !== null && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)' }}>
          <span className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>👥</span>
          <span className="font-rajdhani text-xs font-bold tabular-nums"
            style={{ color: '#F5C842' }}>
            {fmt(total)}
          </span>
          <span className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>игроков</span>
        </div>
      )}
    </div>
  );
}
