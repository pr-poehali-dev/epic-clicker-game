import { formatNumber, rarityColors } from '@/game/gameState';

interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

const rarityLabel: Record<string, string> = {
  common: 'ОБЫЧНЫЙ',
  rare: 'РЕДКИЙ',
  epic: 'ЭПИЧЕСКИЙ',
  legendary: 'ЛЕГЕНДАРНЫЙ',
};

export default function CharactersScreen({ engine }: Props) {
  const { state, buyCharacter, upgradeCharacter, toggleCharacter, getUpgradeCost } = engine;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">⚔️ ГЕРОИ</div>
      <div className="font-rajdhani text-center text-sm mb-4" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Открывай легендарных героев и создавай мощный отряд
      </div>

      <div className="space-y-3">
        {state.characters.map(char => {
          const upgCost = getUpgradeCost(char.id);
          const canAffordBuy = !char.owned && state.gold >= char.cost;
          const canAffordUpg = char.owned && state.gold >= upgCost && char.level < char.maxLevel;
          const ownedSynergies = char.synergy.filter(id =>
            state.characters.find(c => c.id === id)?.owned
          ).length;

          return (
            <div key={char.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: char.owned
                  ? 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(10,10,15,0.98) 100%)'
                  : 'linear-gradient(135deg, rgba(15,15,25,0.8) 0%, rgba(10,10,15,0.9) 100%)',
                border: char.owned
                  ? `1px solid ${char.color}44`
                  : '1px solid rgba(255,255,255,0.06)',
                opacity: char.owned ? 1 : 0.8,
              }}>

              {/* Rarity strip */}
              <div className="h-0.5 w-full" style={{ background: char.owned ? char.color : 'rgba(255,255,255,0.1)' }} />

              <div className="p-3 flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden"
                    style={{
                      border: `1.5px solid ${char.owned ? char.color + '88' : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: char.owned ? `0 0 15px ${char.color}33` : 'none',
                    }}>
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      style={{ filter: char.owned ? 'none' : 'grayscale(80%) brightness(0.4)' }}
                    />
                  </div>
                  {!char.owned && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl rounded-xl"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>🔒</div>
                  )}
                  {char.owned && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: char.color, color: '#0A0A0F', fontFamily: 'Cinzel', fontWeight: 700 }}>
                      {char.level}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <div>
                      <div className="font-cinzel font-bold text-sm" style={{ color: char.owned ? '#F5C842' : '#6B7280' }}>
                        {char.emoji} {char.name}
                      </div>
                      <div className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)' }}>{char.title}</div>
                    </div>
                    <div className="font-rajdhani text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: `${rarityColors[char.rarity]}22`,
                        color: rarityColors[char.rarity],
                        border: `1px solid ${rarityColors[char.rarity]}44`,
                        fontSize: '9px',
                        flexShrink: 0,
                      }}>
                      {rarityLabel[char.rarity]}
                    </div>
                  </div>

                  <div className="font-rajdhani text-xs mb-2" style={{ color: '#6B7280', lineHeight: '1.3' }}>
                    {char.description}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-3 mb-2">
                    <div className="font-rajdhani text-xs">
                      <span style={{ color: 'rgba(212,160,23,0.5)' }}>👆 </span>
                      <span style={{ color: '#D4A017' }}>{char.clickPower * char.level}</span>
                    </div>
                    <div className="font-rajdhani text-xs">
                      <span style={{ color: 'rgba(204,34,0,0.7)' }}>⚡ </span>
                      <span style={{ color: '#FF6644' }}>{char.dps * char.level}/с</span>
                    </div>
                    {ownedSynergies > 0 && (
                      <div className="font-rajdhani text-xs">
                        <span style={{ color: 'rgba(124,58,237,0.7)' }}>🔗 </span>
                        <span style={{ color: '#A78BFA' }}>+{ownedSynergies * 15}%</span>
                      </div>
                    )}
                  </div>

                  {/* Skill */}
                  <div className="rounded-lg px-2 py-1 mb-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="font-cinzel text-xs" style={{ color: char.color, fontSize: '10px' }}>✦ {char.skill}: </span>
                    <span className="font-rajdhani text-xs" style={{ color: 'rgba(212,160,23,0.5)', fontSize: '10px' }}>{char.skillDesc}</span>
                  </div>

                  {/* Synergy */}
                  <div className="font-rajdhani text-xs mb-2" style={{ color: 'rgba(124,58,237,0.7)', fontSize: '10px' }}>
                    🔗 Синергия: {char.synergy.map(id => {
                      const s = state.characters.find(c => c.id === id);
                      return s ? `${s.emoji}${s.name}${state.characters.find(c => c.id === id)?.owned ? '✓' : ''}` : id;
                    }).join(' + ')}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {!char.owned ? (
                      <button
                        onClick={() => buyCharacter(char.id)}
                        disabled={!canAffordBuy}
                        className="flex-1 rounded-lg py-1.5 font-cinzel text-xs font-bold transition-all"
                        style={{
                          background: canAffordBuy
                            ? 'linear-gradient(135deg, #8B6914, #D4A017)'
                            : 'rgba(255,255,255,0.05)',
                          color: canAffordBuy ? '#0A0A0F' : '#4B5563',
                          border: canAffordBuy ? '1px solid #D4A01788' : '1px solid rgba(255,255,255,0.06)',
                          cursor: canAffordBuy ? 'pointer' : 'not-allowed',
                        }}>
                        {char.cost === 0 ? '🎁 БЕСПЛАТНО' : `💰 ${formatNumber(char.cost)}`}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => upgradeCharacter(char.id)}
                          disabled={!canAffordUpg}
                          className="flex-1 rounded-lg py-1.5 font-cinzel text-xs font-bold transition-all"
                          style={{
                            background: canAffordUpg
                              ? `linear-gradient(135deg, ${char.color}88, ${char.color})`
                              : 'rgba(255,255,255,0.05)',
                            color: canAffordUpg ? '#0A0A0F' : '#4B5563',
                            border: `1px solid ${canAffordUpg ? char.color + '88' : 'rgba(255,255,255,0.06)'}`,
                            cursor: canAffordUpg ? 'pointer' : 'not-allowed',
                          }}>
                          {char.level >= char.maxLevel ? '✦ МАКС' : `⬆ ${formatNumber(upgCost)}💰`}
                        </button>
                        <button
                          onClick={() => toggleCharacter(char.id)}
                          className="px-3 rounded-lg text-xs font-bold transition-all"
                          style={{
                            background: char.active ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.05)',
                            color: char.active ? '#D4A017' : '#6B7280',
                            border: char.active ? '1px solid rgba(212,160,23,0.3)' : '1px solid rgba(255,255,255,0.06)',
                          }}>
                          {char.active ? '✓ В бою' : '○ Откл'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
