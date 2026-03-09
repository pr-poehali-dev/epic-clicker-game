import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';
import OnlineBadge from '@/components/game/OnlineBadge';

const FEATURES = [
  { icon: 'Swords', title: 'Эпические битвы', desc: 'Сражайся с легендарными боссами и добывай редкие трофеи' },
  { icon: 'Users', title: 'Отряд героев', desc: '6 уникальных персонажей с синергиями и особыми умениями' },
  { icon: 'Zap', title: 'Авто-атаки', desc: 'Прокачай DPS и зарабатывай золото даже когда ты офлайн' },
  { icon: 'Trophy', title: 'Достижения', desc: 'Десятки наград за мастерство — от бронзы до платины' },
];

const HEROES = [
  { name: 'Кратос', class: 'Воин', rarity: 'Epic', color: '#d4a017', emoji: '⚔️' },
  { name: 'Зараэль', class: 'Маг', rarity: 'Legendary', color: '#9b59b6', emoji: '✨' },
  { name: 'Мортис', class: 'Некромант', rarity: 'Epic', color: '#2ecc71', emoji: '💀' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0A0A0F 70%)' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-cinzel font-bold text-gold glow-text-gold tracking-widest">EPIC</span>
          <span className="text-2xl font-cinzel font-bold text-white tracking-widest">CLICKER</span>
        </div>

        {/* Online counter */}
        <OnlineBadge />

        <div className="flex gap-3">
          {user ? (
            <button
              onClick={() => navigate('/game')}
              className="btn-epic px-5 py-2 rounded-lg text-sm font-cinzel"
            >
              Играть
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 rounded-lg text-sm font-cinzel border border-white/20 text-white/80 hover:border-gold/50 hover:text-gold transition-all"
              >
                Войти
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-epic px-5 py-2 rounded-lg text-sm font-cinzel"
              >
                Начать
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative text-center px-6 py-24 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#d4a017' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: '#cc2200' }} />
          <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-gold-light animate-pulse" />
          <div className="absolute bottom-20 left-16 w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
          <div className="absolute top-32 left-8 w-1 h-1 rounded-full bg-white/40 animate-pulse" />
          <div className="absolute top-48 right-16 w-1 h-1 rounded-full bg-gold/60 animate-ping" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm font-oswald tracking-widest uppercase">
            <Icon name="Sparkles" size={14} />
            Idle RPG Кликер
          </div>

          <h1 className="font-cinzel text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
            Стань
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #8b6914, #d4a017, #f5c842, #d4a017, #8b6914)' }}>
              Легендой
            </span>
          </h1>

          <p className="text-white/60 text-xl md:text-2xl font-rajdhani mb-10 max-w-2xl mx-auto leading-relaxed">
            Собери отряд эпических героев, сокруши древних боссов и завоюй власть над тёмным миром
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate(user ? '/game' : '/register')}
              className="btn-epic px-10 py-4 rounded-xl text-lg font-cinzel font-bold tracking-wide glow-gold transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Icon name="Swords" size={20} />
                {user ? 'Продолжить игру' : 'Начать бесплатно'}
              </span>
            </button>
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-4 rounded-xl text-lg font-cinzel border border-white/20 text-white/80 hover:border-gold/40 hover:text-gold transition-all"
              >
                Уже есть аккаунт
              </button>
            )}
          </div>

          {/* Hero characters preview */}
          <div className="flex justify-center gap-6">
            {HEROES.map((hero) => (
              <div
                key={hero.name}
                className="card-epic rounded-2xl px-6 py-5 text-center border hover:border-gold/40 transition-all hover:-translate-y-1 cursor-default"
                style={{ borderColor: hero.color + '33', minWidth: 110 }}
              >
                <div className="text-4xl mb-2">{hero.emoji}</div>
                <div className="font-cinzel text-white text-sm font-bold">{hero.name}</div>
                <div className="text-white/40 text-xs font-oswald tracking-widest uppercase mt-1">{hero.class}</div>
                <div className="mt-2 text-xs font-oswald tracking-widest uppercase" style={{ color: hero.color }}>{hero.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-white/2 py-8">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '6', label: 'Героев' },
            { value: '∞', label: 'Боссов' },
            { value: '24+', label: 'Достижений' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-cinzel text-4xl font-black text-gold glow-text-gold">{s.value}</div>
              <div className="text-white/50 font-oswald tracking-widest uppercase text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Что тебя ждёт
          </h2>
          <p className="text-white/40 text-center font-rajdhani text-lg mb-14">Погрузись в мир тёмного фэнтези</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-epic rounded-2xl p-6 flex gap-4 border border-gold/10 hover:border-gold/25 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-all border border-gold/20">
                  <Icon name={f.icon} size={22} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-cinzel text-white font-bold text-base mb-1">{f.title}</h3>
                  <p className="text-white/50 font-rajdhani text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOSS SECTION */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 blur-3xl" style={{ background: '#cc2200' }} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="text-8xl mb-6 animate-float">🐲</div>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-4">
            Сразись с <span className="text-crimson glow-text-gold">Боссами</span>
          </h2>
          <p className="text-white/50 font-rajdhani text-lg mb-8 max-w-xl mx-auto">
            Легендарные чудовища охраняют несметные сокровища. Только сильнейшие воины смогут их одолеть.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {['🐺 Волк-тень', '🔥 Дракон Хаоса', '💀 Лич Вечности', '🌑 Тёмный Владыка'].map((boss) => (
              <span key={boss} className="card-boss px-4 py-2 rounded-lg text-white/70 text-sm font-oswald tracking-wide border border-red-900/30">
                {boss}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-epic rounded-3xl p-12 border border-gold/15 relative overflow-hidden rune-border">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #d4a017 0%, transparent 70%)' }} />
            <h2 className="font-cinzel text-3xl font-black text-white mb-4 relative">
              Начни своё <span className="text-gold">приключение</span>
            </h2>
            <p className="text-white/50 font-rajdhani text-lg mb-8 relative">
              Регистрация бесплатна. Твои герои ждут тебя.
            </p>
            <button
              onClick={() => navigate(user ? '/game' : '/register')}
              className="btn-epic px-12 py-4 rounded-xl text-lg font-cinzel font-bold tracking-wide glow-gold hover:scale-105 active:scale-95 transition-all relative"
            >
              <span className="flex items-center gap-2">
                <Icon name="Crown" size={20} />
                {user ? 'В игру!' : 'Создать аккаунт'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="font-cinzel text-gold/60 text-sm tracking-widest">EPIC CLICKER © 2024</p>
        <p className="text-white/20 text-xs mt-1 font-rajdhani">Тёмное фэнтези · Idle RPG</p>
      </footer>
    </div>
  );
}