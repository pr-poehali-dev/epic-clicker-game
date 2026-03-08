import { useState } from 'react';
import { formatNumber, rarityColors, Character } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const rarityLabel: Record<string, string> = {
  common: 'ОБЫЧНЫЙ',
  rare: 'РЕДКИЙ',
  epic: 'ЭПИЧЕСКИЙ',
  legendary: 'ЛЕГЕНДАРНЫЙ',
};

function CharacterModal({
  char,
  engine,
  onClose,
}: {
  char: Character;
  engine: Props['engine'];
  onClose: () => void;
}) {
  const { state, buyCharacter, upgradeCharacter, toggleCharacter, getUpgradeCost } = engine;
  const upgCost = getUpgradeCost(char.id);
  const canAffordBuy = !char.owned && state.gold >= char.cost;
  const canAffordUpg = char.owned && state.gold >= upgCost && char.level < char.maxLevel;
  const ownedSynergies = char.synergy.filter(id =>
    state.characters.find(c => c.id === id)?.owned
  ).length;
  const levelPct = (char.level / char.maxLevel) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl overflow-hidden animate-slide-in-up"
        style={{
          background: 'linear-gradient(180deg, rgba(20,10,30,0.99) 0%, rgba(10,10,15,1) 100%)',
          border: `1px solid ${char.color}44`,
          borderBottom: 'none',
          boxShadow: `0 -20px 60px ${char.color}22`,
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={char.image}
            alt={char.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: char.owned ? 'saturate(1.2)' : 'grayscale(70%) brightness(0.4)' }}
          />
          {/* Gradient */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,1) 100%)' }} />
          {/* Color glow */}
          <div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${char.color}18 0%, transparent 70%)` }} />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ background: 'rgba(0,0,0,0.6)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)' }}>
            ✕
          </button>

          {/* Rarity badge */}
          <div className="absolute top-4 left-4">
            <span className="font-rajdhani text-xs px-2.5 py-1 rounded-full font-bold"
              style={{
                background: `${rarityColors[char.rarity]}22`,
                color: rarityColors[char.rarity],
                border: `1px solid ${rarityColors[char.rarity]}66`,
                letterSpacing: '0.08em',
              }}>
              {rarityLabel[char.rarity]}
            </span>
          </div>

          {/* Lock overlay */}
          {!char.owned && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl" style={{ paddingBottom: '80px' }}>🔒</div>
          )}

          {/* Name block */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="font-cinzel font-bold text-2xl" style={{ color: char.color, textShadow: `0 0 30px ${char.color}88` }}>
              {char.emoji} {char.name}
            </div>
            <div className="font-rajdhani text-sm" style={{ color: 'rgba(212,160,23,0.6)', letterSpacing: '0.12em' }}>
              {char.title.toUpperCase()} · {char.class.toUpperCase()} · {char.element.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">

          {/* Level bar */}
          {char.owned && (
            <div>
              <div className="flex justify-between font-rajdhani text-xs mb-1.5" style={{ color: 'rgba(212,160,23,0.6)' }}>
                <span>Уровень {char.level}</span>
                <span>{char.level} / {char.maxLevel}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelPct}%`, background: `linear-gradient(90deg, ${char.color}88, ${char.color})` }} />
              </div>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Клик', value: char.owned ? char.clickPower * char.level : char.clickPower, icon: '👆', color: '#D4A017' },
              { label: 'DPS', value: `${char.owned ? char.dps * char.level : char.dps}/с`, icon: '⚡', color: '#FF6644' },
              { label: 'Синергия', value: `+${ownedSynergies * 15}%`, icon: '🔗', color: '#A78BFA' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-cinzel font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '10px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-rajdhani text-sm" style={{ color: '#9CA3AF', lineHeight: '1.5' }}>{char.description}</div>
          </div>

          {/* Skill */}
          <div className="rounded-xl p-3" style={{ background: `${char.color}0d`, border: `1px solid ${char.color}33` }}>
            <div className="font-cinzel text-xs font-bold mb-1" style={{ color: char.color }}>✦ УМЕНИЕ: {char.skill}</div>
            <div className="font-rajdhani text-sm" style={{ color: 'rgba(212,160,23,0.6)' }}>{char.skillDesc}</div>
          </div>

          {/* Synergy */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="font-cinzel text-xs font-bold mb-2" style={{ color: '#A78BFA' }}>🔗 СИНЕРГИЯ ОТРЯДА</div>
            <div className="flex gap-2">
              {char.synergy.map(id => {
                const s = state.characters.find(c => c.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                    style={{
                      background: s.owned ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                      border: s.owned ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    }}>
                    <span className="text-base">{s.emoji}</span>
                    <div>
                      <div className="font-rajdhani text-xs font-bold" style={{ color: s.owned ? '#A78BFA' : '#4B5563', fontSize: '10px' }}>{s.name}</div>
                      <div className="font-rajdhani" style={{ color: s.owned ? '#7C3AED' : '#374151', fontSize: '9px' }}>{s.owned ? '✓ актив' : '🔒'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-2">
            {!char.owned ? (
              <button
                onClick={() => { buyCharacter(char.id); onClose(); }}
                disabled={!canAffordBuy}
                className="flex-1 py-3 rounded-xl font-cinzel font-bold transition-all"
                style={{
                  background: canAffordBuy
                    ? `linear-gradient(135deg, ${char.color}88, ${char.color})`
                    : 'rgba(255,255,255,0.05)',
                  color: canAffordBuy ? '#0A0A0F' : '#4B5563',
                  border: canAffordBuy ? `1px solid ${char.color}88` : '1px solid rgba(255,255,255,0.06)',
                  cursor: canAffordBuy ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                }}>
                {char.cost === 0 ? '🎁 ПОЛУЧИТЬ БЕСПЛАТНО' : `💰 КУПИТЬ ЗА ${formatNumber(char.cost)}`}
              </button>
            ) : (
              <>
                <button
                  onClick={() => upgradeCharacter(char.id)}
                  disabled={!canAffordUpg}
                  className="flex-1 py-3 rounded-xl font-cinzel font-bold transition-all"
                  style={{
                    background: canAffordUpg
                      ? `linear-gradient(135deg, ${char.color}88, ${char.color})`
                      : 'rgba(255,255,255,0.05)',
                    color: canAffordUpg ? '#0A0A0F' : '#4B5563',
                    border: `1px solid ${canAffordUpg ? char.color + '88' : 'rgba(255,255,255,0.06)'}`,
                    cursor: canAffordUpg ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                  }}>
                  {char.level >= char.maxLevel ? '✦ МАКС УРОВЕНЬ' : `⬆ УЛУЧШИТЬ ${formatNumber(upgCost)}💰`}
                </button>
                <button
                  onClick={() => toggleCharacter(char.id)}
                  className="px-4 py-3 rounded-xl font-cinzel font-bold transition-all"
                  style={{
                    background: char.active ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.05)',
                    color: char.active ? '#D4A017' : '#6B7280',
                    border: char.active ? '1px solid rgba(212,160,23,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    fontSize: '13px',
                  }}>
                  {char.active ? '✓ В ОТРЯДЕ' : '+ В ОТРЯД'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharactersScreen({ engine }: Props) {
  const { state } = engine;
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">⚔️ ГЕРОИ</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Нажми на героя чтобы узнать подробности
      </div>

      <div className="space-y-3">
        {state.characters.map(char => {
          const ownedSynergies = char.synergy.filter(id =>
            state.characters.find(c => c.id === id)?.owned
          ).length;

          return (
            <div key={char.id}
              onClick={() => setSelected(char)}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 active:scale-98"
              style={{
                background: char.owned
                  ? 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(10,10,15,0.98) 100%)'
                  : 'linear-gradient(135deg, rgba(15,15,25,0.8) 0%, rgba(10,10,15,0.9) 100%)',
                border: char.owned
                  ? `1px solid ${char.color}44`
                  : '1px solid rgba(255,255,255,0.06)',
                opacity: char.owned ? 1 : 0.8,
                boxShadow: char.owned ? `0 0 20px ${char.color}0d` : 'none',
              }}>

              <div className="h-0.5 w-full" style={{ background: char.owned ? char.color : 'rgba(255,255,255,0.1)' }} />

              <div className="p-3 flex gap-3 items-center">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden"
                    style={{
                      border: `1.5px solid ${char.owned ? char.color + '88' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: char.owned ? `0 0 12px ${char.color}33` : 'none',
                    }}>
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      style={{ filter: char.owned ? 'none' : 'grayscale(80%) brightness(0.4)' }}
                    />
                  </div>
                  {!char.owned && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl rounded-xl"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>🔒</div>
                  )}
                  {char.owned && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: char.color, color: '#0A0A0F', fontFamily: 'Cinzel', fontWeight: 700, fontSize: '10px' }}>
                      {char.level}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-cinzel font-bold text-sm" style={{ color: char.owned ? '#F5C842' : '#6B7280' }}>
                      {char.emoji} {char.name}
                    </span>
                    <span className="font-rajdhani text-xs px-1.5 rounded"
                      style={{
                        background: `${rarityColors[char.rarity]}22`,
                        color: rarityColors[char.rarity],
                        border: `1px solid ${rarityColors[char.rarity]}44`,
                        fontSize: '9px',
                      }}>
                      {rarityLabel[char.rarity]}
                    </span>
                  </div>
                  <div className="font-rajdhani text-xs mb-1.5" style={{ color: 'rgba(212,160,23,0.45)' }}>{char.title}</div>
                  <div className="flex gap-3">
                    <span className="font-rajdhani text-xs" style={{ color: '#D4A017' }}>👆 {char.clickPower * char.level}</span>
                    <span className="font-rajdhani text-xs" style={{ color: '#FF6644' }}>⚡ {char.dps * char.level}/с</span>
                    {ownedSynergies > 0 && (
                      <span className="font-rajdhani text-xs" style={{ color: '#A78BFA' }}>🔗 +{ownedSynergies * 15}%</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="font-rajdhani text-lg flex-shrink-0" style={{ color: `${char.color}66` }}>›</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <CharacterModal
          char={state.characters.find(c => c.id === selected.id) ?? selected}
          engine={engine}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
