import { formatNumber } from '@/game/gameState';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import OnlineBadge from '@/components/game/OnlineBadge';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
  screen: string;
}

export default function TopBar({ engine }: Props) {
  const { state } = engine;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.9) 100%)',
        borderBottom: '1px solid rgba(212,160,23,0.2)',
        backdropFilter: 'blur(12px)',
      }}>
      <div className="px-4 py-1.5 flex justify-center border-b border-white/5">
        <OnlineBadge />
      </div>
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl animate-float">⚔️</div>
          <div>
            <div className="font-cinzel text-gold-light text-sm font-bold leading-none glow-text-gold">EPIC CLICKER</div>
            {user && <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>{user.username}</div>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>ЗОЛОТО</div>
              <div className="font-cinzel text-sm font-bold text-gold-light">{formatNumber(state.gold)} 💰</div>
            </div>
            <div className="text-center">
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>УРОВЕНЬ</div>
              <div className="font-cinzel text-sm font-bold" style={{ color: '#F5C842' }}>⭐ {state.level}</div>
            </div>
            <div className="text-center">
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(204,34,0,0.8)' }}>DPS</div>
              <div className="font-cinzel text-sm font-bold" style={{ color: '#FF6644' }}>{formatNumber(state.dps)}/с</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Выйти"
            className="ml-1 p-1.5 rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all"
          >
            <Icon name="LogOut" size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}