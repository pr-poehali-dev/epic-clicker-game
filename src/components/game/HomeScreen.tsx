import { useState, useRef } from 'react';
import { formatNumber, BOSS_IMG } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function HomeScreen({ engine }: Props) {
  const { state, handleClick, startBossFight, retreatBoss, formatNumber: fmt } = engine;
  const [localParticles, setLocalParticles] = useState<Particle[]>([]);
  const [clicking, setClicking] = useState(false);
  const particleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentBoss = state.bosses[state.currentBoss];
  const activeChar = state.characters.find(c => c.owned && c.active);
  const ownedCount = state.characters.filter(c => c.owned).length;
  const synergyBonus = engine.getSynergyBonus();
  const bossHpPct = currentBoss ? (currentBoss.hp / currentBoss.maxHp) * 100 : 100;

  const onAreaClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++particleId.current;
    const value = Math.floor(state.clickPower * synergyBonus);

    setClicking(true);
    setTimeout(() => setClicking(false), 150);
    setLocalParticles(prev => [...prev, { id, x, y, value }]);
    setTimeout(() => setLocalParticles(prev => prev.filter(p => p.id !== id)), 1200);
    handleClick(x, y);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Клик', value: fmt(Math.floor(state.clickPower * synergyBonus)), icon: '👆', color: '#D4A017' },
          { label: 'DPS', value: fmt(Math.floor(state.dps * synergyBonus)), icon: '⚡', color: '#CC2200' },
          { label: 'Синерг', value: `x${synergyBonus.toFixed(1)}`, icon: '🔗', color: '#7C3AED' },
        ].map(stat => (
          <div key={stat.label} className="card-epic rounded-xl p-2 text-center">
            <div className="text-lg">{stat.icon}</div>
            <div className="font-cinzel text-xs font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* XP bar */}
      <div className="mb-4">
        <div className="flex justify-between font-rajdhani text-xs mb-1" style={{ color: 'rgba(212,160,23,0.7)' }}>
          <span>Уровень {state.level}</span>
          <span>{Math.floor(state.xp)} / {state.xpRequired} опыта</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full progress-bar-gold" style={{ width: `${(state.xp / state.xpRequired) * 100}%` }} />
        </div>
      </div>

      {/* Boss section */}
      {!state.bossActive ? (
        <div className="card-epic rounded-2xl p-4 mb-4 text-center">
          <div className="font-rajdhani text-xs mb-1" style={{ color: 'rgba(212,160,23,0.6)' }}>СЛЕДУЮЩИЙ ПРОТИВНИК</div>
          {currentBoss ? (
            <>
              <div className="text-4xl mb-1">{currentBoss.emoji}</div>
              <div className="font-cinzel font-bold text-lg text-gold-light">{currentBoss.name}</div>
              <div className="font-rajdhani text-sm mb-3" style={{ color: 'rgba(212,160,23,0.6)' }}>{currentBoss.title}</div>
              <div className="font-rajdhani text-xs mb-3" style={{ color: '#9CA3AF' }}>{currentBoss.description}</div>
              <button onClick={startBossFight}
                className="btn-crimson px-6 py-2 rounded-xl font-bold text-sm w-full"
                style={{ fontFamily: 'Cinzel, serif' }}>
                ⚔️ СРАЗИТЬСЯ С БОССОМ
              </button>
            </>
          ) : (
            <div className="text-gray-500 font-rajdhani">Все боссы побеждены!</div>
          )}
        </div>
      ) : (
        <div className="card-boss rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-cinzel font-bold text-lg" style={{ color: '#FF4444' }}>{currentBoss?.emoji} {currentBoss?.name}</div>
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(255,100,100,0.7)' }}>{currentBoss?.title}</div>
            </div>
            <button onClick={retreatBoss}
              className="font-rajdhani text-xs px-3 py-1 rounded-lg border"
              style={{ borderColor: 'rgba(255,100,100,0.3)', color: 'rgba(255,100,100,0.7)', background: 'rgba(255,0,0,0.05)' }}>
              Отступить
            </button>
          </div>
          <div className="flex justify-between font-rajdhani text-xs mb-1" style={{ color: 'rgba(255,100,100,0.7)' }}>
            <span>HP Босса</span>
            <span>{formatNumber(currentBoss?.hp ?? 0)} / {formatNumber(currentBoss?.maxHp ?? 0)}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full progress-bar-inner transition-all duration-300" style={{ width: `${bossHpPct}%` }} />
          </div>
          <div className="font-rajdhani text-center text-xs" style={{ color: 'rgba(212,160,23,0.6)' }}>
            Нажмите на арену для атаки!
          </div>
        </div>
      )}

      {/* Click arena */}
      <div
        ref={containerRef}
        onClick={onAreaClick}
        className="relative rounded-2xl overflow-hidden cursor-pointer select-none mb-4"
        style={{
          minHeight: '260px',
          background: state.bossActive
            ? 'linear-gradient(135deg, rgba(139,0,0,0.3) 0%, rgba(10,10,15,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(26,26,46,0.9) 0%, rgba(10,10,15,0.95) 100%)',
          border: state.bossActive ? '1px solid rgba(204,34,0,0.4)' : '1px solid rgba(212,160,23,0.2)',
          boxShadow: state.bossActive ? '0 0 30px rgba(204,34,0,0.2) inset' : '0 0 20px rgba(212,160,23,0.05) inset',
        }}>
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full animate-screen-glow"
            style={{
              background: state.bossActive
                ? 'radial-gradient(circle, rgba(204,34,0,0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(212,160,23,0.1) 0%, transparent 70%)'
            }} />
        </div>

        {/* Character / Boss image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {state.bossActive && currentBoss ? (
            <img
              src={BOSS_IMG}
              alt={currentBoss.name}
              className={`w-48 h-48 object-cover rounded-xl transition-transform duration-100 ${clicking ? 'scale-95' : 'scale-100'}`}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(204,34,0,0.5))',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              }}
            />
          ) : activeChar ? (
            <img
              src={activeChar.image}
              alt={activeChar.name}
              className={`w-40 h-40 object-cover rounded-xl transition-transform duration-100 ${clicking ? 'scale-110' : 'scale-100'}`}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(212,160,23,0.4))',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              }}
            />
          ) : (
            <div className="text-6xl animate-float">⚔️</div>
          )}
        </div>

        {/* Rune decorations */}
        <div className="absolute top-4 left-4 text-2xl opacity-20 animate-rune-spin" style={{ animationDuration: '12s' }}>᚛</div>
        <div className="absolute top-4 right-4 text-2xl opacity-20 animate-rune-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>᚜</div>
        <div className="absolute bottom-4 left-4 text-xl opacity-20">ᚠ</div>
        <div className="absolute bottom-4 right-4 text-xl opacity-20">ᚢ</div>

        {/* Click hint */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span className="font-cinzel text-xs" style={{ color: 'rgba(212,160,23,0.4)' }}>
            {state.bossActive ? '⚔️ НАЖМИТЕ ДЛЯ АТАКИ' : '👆 НАЖМИТЕ ДЛЯ СБОРА ЗОЛОТА'}
          </span>
        </div>

        {/* Damage particles */}
        {localParticles.map(p => (
          <div key={p.id}
            className="absolute pointer-events-none font-cinzel font-bold animate-damage-float"
            style={{
              left: p.x - 20,
              top: p.y - 20,
              color: state.bossActive ? '#FF6644' : '#F5C842',
              fontSize: '16px',
              textShadow: state.bossActive ? '0 0 10px rgba(255,100,50,0.8)' : '0 0 10px rgba(245,200,66,0.8)',
              zIndex: 10,
            }}>
            {state.bossActive ? `-${formatNumber(Math.floor(state.clickPower * synergyBonus))}` : `+${formatNumber(Math.floor(state.clickPower * synergyBonus))}💰`}
          </div>
        ))}
      </div>

      {/* Active party */}
      <div className="card-epic rounded-xl p-3">
        <div className="font-cinzel text-xs text-gold-light mb-2 font-bold">⚔️ АКТИВНЫЙ ОТРЯД ({ownedCount}/{state.characters.length})</div>
        <div className="flex gap-2 flex-wrap">
          {state.characters.filter(c => c.owned).map(char => (
            <div key={char.id}
              onClick={() => engine.toggleCharacter(char.id)}
              className="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200"
              style={{
                background: char.active ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.03)',
                border: char.active ? '1px solid rgba(212,160,23,0.4)' : '1px solid rgba(255,255,255,0.05)',
                opacity: char.active ? 1 : 0.5,
              }}>
              <div className="text-xl mb-1">{char.emoji}</div>
              <div className="font-rajdhani text-xs font-bold" style={{ color: char.color, fontSize: '10px' }}>{char.name}</div>
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)', fontSize: '9px' }}>Ур.{char.level}</div>
            </div>
          ))}
          {state.characters.filter(c => !c.owned).slice(0, 2).map(char => (
            <div key={char.id}
              className="flex flex-col items-center p-2 rounded-lg opacity-30"
              style={{ border: '1px dashed rgba(212,160,23,0.2)' }}>
              <div className="text-xl mb-1">🔒</div>
              <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '10px' }}>{char.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Event banner */}
      {state.activeEvent && (
        <div className="mt-4 rounded-xl p-3 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(10,10,15,0.9))', border: '1px solid rgba(124,58,237,0.4)' }}>
          <div className="font-cinzel text-sm font-bold" style={{ color: '#A78BFA' }}>
            {state.activeEvent.emoji} {state.activeEvent.name}
          </div>
          <div className="font-rajdhani text-xs" style={{ color: 'rgba(167,139,250,0.7)' }}>{state.activeEvent.description}</div>
        </div>
      )}
    </div>
  );
}