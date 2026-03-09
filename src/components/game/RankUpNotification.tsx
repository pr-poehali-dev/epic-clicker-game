import { useEffect, useState } from 'react';
import { RankUpEvent } from '@/hooks/useRankTracker';

interface Props {
  event: RankUpEvent | null;
  onClose: () => void;
}

export default function RankUpNotification({ event, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 4000);
    return () => clearTimeout(t);
  }, [event, onClose]);

  if (!event) return null;

  const isTop3 = event.newRank <= 3;
  const medals: Record<number, string> = { 1: '👑', 2: '🥈', 3: '🥉' };

  return (
    <div
      className="fixed top-20 left-1/2 z-50 pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${visible ? '0' : '-20px'})`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
      <div
        className="px-5 py-4 rounded-2xl text-center shadow-2xl"
        style={{
          background: isTop3
            ? 'linear-gradient(135deg, rgba(212,160,23,0.25), rgba(245,200,66,0.1))'
            : 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.1))',
          border: `1px solid ${isTop3 ? 'rgba(212,160,23,0.6)' : 'rgba(124,58,237,0.5)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: isTop3
            ? '0 0 40px rgba(212,160,23,0.3), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 0 40px rgba(124,58,237,0.3), 0 8px 32px rgba(0,0,0,0.5)',
          minWidth: '260px',
        }}>
        <div className="text-3xl mb-1">
          {medals[event.newRank] || '⚔️'}
        </div>
        <div className="font-cinzel font-bold text-base mb-0.5"
          style={{ color: isTop3 ? '#F5C842' : '#A78BFA' }}>
          {isTop3 ? 'ЭПИЧЕСКОЕ ДОСТИЖЕНИЕ!' : 'НОВАЯ ПОЗИЦИЯ!'}
        </div>
        <div className="font-rajdhani text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Ты поднялся с{' '}
          <span style={{ color: 'rgba(212,160,23,0.7)' }}>#{event.oldRank}</span>
          {' '}на{' '}
          <span className="font-bold" style={{ color: isTop3 ? '#F5C842' : '#A78BFA' }}>
            #{event.newRank}
          </span>
          {' '}в рейтинге!
        </div>
        {isTop3 && (
          <div className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Легенда вписана в летопись
          </div>
        )}
      </div>
    </div>
  );
}
