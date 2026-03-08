interface Props {
  engine: ReturnType<typeof import('@/game/useGameEngine').useGameEngine>;
}

export default function SettingsScreen({ engine }: Props) {
  const { state, resetGame } = engine;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="font-cinzel text-xl font-bold text-gold-light glow-text-gold mb-1 text-center">⚙️ НАСТРОЙКИ</div>
      <div className="font-rajdhani text-center text-sm mb-6" style={{ color: 'rgba(212,160,23,0.6)' }}>
        Настрой игру под себя, великий герой
      </div>

      {/* Settings blocks */}
      <div className="space-y-3">

        {/* Sound */}
        <div className="card-epic rounded-xl p-4">
          <div className="font-cinzel text-sm font-bold text-gold-light mb-3">🔊 ЗВУК</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-rajdhani text-sm font-semibold" style={{ color: '#D4D4D8' }}>Звуковые эффекты</div>
                <div className="font-rajdhani text-xs" style={{ color: '#6B7280' }}>Звуки ударов и событий</div>
              </div>
              <div
                className="w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300"
                style={{
                  background: state.settings.soundEnabled ? '#D4A017' : 'rgba(255,255,255,0.1)',
                }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300"
                  style={{ left: state.settings.soundEnabled ? '26px' : '2px' }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-rajdhani text-sm font-semibold" style={{ color: '#D4D4D8' }}>Музыка</div>
                <div className="font-rajdhani text-xs" style={{ color: '#6B7280' }}>Эпический саундтрек</div>
              </div>
              <div
                className="w-12 h-6 rounded-full relative cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Graphics */}
        <div className="card-epic rounded-xl p-4">
          <div className="font-cinzel text-sm font-bold text-gold-light mb-3">✨ ГРАФИКА</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-rajdhani text-sm font-semibold" style={{ color: '#D4D4D8' }}>Частицы</div>
                <div className="font-rajdhani text-xs" style={{ color: '#6B7280' }}>Эффекты при кликах</div>
              </div>
              <div
                className="w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300"
                style={{ background: state.settings.particlesEnabled ? '#D4A017' : 'rgba(255,255,255,0.1)' }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300"
                  style={{ left: state.settings.particlesEnabled ? '26px' : '2px' }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-rajdhani text-sm font-semibold" style={{ color: '#D4D4D8' }}>Анимации</div>
                <div className="font-rajdhani text-xs" style={{ color: '#6B7280' }}>Плавные переходы и эффекты</div>
              </div>
              <div
                className="w-12 h-6 rounded-full relative cursor-pointer"
                style={{ background: '#D4A017' }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Game info */}
        <div className="card-epic rounded-xl p-4">
          <div className="font-cinzel text-sm font-bold text-gold-light mb-3">📋 ИГРА</div>
          <div className="space-y-2">
            {[
              { label: 'Версия', value: 'v1.0.0 Epic' },
              { label: 'Автосохранение', value: 'Каждые 5 сек ✓' },
              { label: 'Сохранение', value: 'Браузер (localStorage)' },
              { label: 'Язык', value: 'Русский 🇷🇺' },
            ].map(info => (
              <div key={info.label} className="flex justify-between py-1"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-rajdhani text-sm" style={{ color: '#6B7280' }}>{info.label}</span>
                <span className="font-rajdhani text-sm" style={{ color: '#D4A017' }}>{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prestige & Reset */}
        <div className="card-epic rounded-xl p-4">
          <div className="font-cinzel text-sm font-bold mb-3" style={{ color: '#8B5CF6' }}>🌟 ПРЕСТИЖ</div>
          <div className="font-rajdhani text-xs mb-3" style={{ color: '#6B7280' }}>
            Сбрось прогресс за постоянный бонус ×1.5 к следующему прохождению. Открывается на 20+ уровне.
          </div>
          <button
            disabled={state.level < 20}
            className="w-full py-2 rounded-xl font-cinzel text-sm font-bold transition-all"
            style={{
              background: state.level >= 20
                ? 'linear-gradient(135deg, #4C1D95, #7C3AED)'
                : 'rgba(255,255,255,0.05)',
              color: state.level >= 20 ? '#E9D5FF' : '#4B5563',
              cursor: state.level >= 20 ? 'pointer' : 'not-allowed',
              border: state.level >= 20 ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
            }}>
            {state.level >= 20 ? '🌟 АКТИВИРОВАТЬ ПРЕСТИЖ' : `🔒 Нужен уровень 20 (текущий: ${state.level})`}
          </button>
        </div>

        {/* Reset */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(204,34,0,0.2)' }}>
          <div className="font-cinzel text-sm font-bold mb-2" style={{ color: '#CC2200' }}>⚠️ ОПАСНАЯ ЗОНА</div>
          <div className="font-rajdhani text-xs mb-3" style={{ color: '#6B7280' }}>
            Полный сброс прогресса. Это действие нельзя отменить!
          </div>
          <button
            onClick={() => {
              if (window.confirm('Ты уверен? Весь прогресс будет уничтожен навсегда!')) {
                resetGame();
              }
            }}
            className="w-full py-2 rounded-xl font-cinzel text-sm font-bold transition-all"
            style={{
              background: 'rgba(204,34,0,0.15)',
              color: '#FF6644',
              border: '1px solid rgba(204,34,0,0.3)',
            }}>
            🗑️ СБРОСИТЬ ПРОГРЕСС
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="font-cinzel text-xs" style={{ color: 'rgba(212,160,23,0.3)' }}>EPIC CLICKER · Легенды Тьмы</div>
        <div className="font-rajdhani text-xs mt-1" style={{ color: 'rgba(212,160,23,0.2)' }}>Создано с ❤️ на poehali.dev</div>
      </div>
    </div>
  );
}
