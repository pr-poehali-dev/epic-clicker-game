import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiRegister } from '@/api/auth';
import Icon from '@/components/ui/icon';
import OnlineBadge from '@/components/game/OnlineBadge';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Пароль минимум 6 символов');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await apiRegister(username, email, password);
      login(token, user);
      navigate('/game');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const rarities = [
    { label: 'Common', color: '#9ca3af' },
    { label: 'Rare', color: '#3b82f6' },
    { label: 'Epic', color: '#a855f7' },
    { label: 'Legendary', color: '#d4a017' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0A0A0F 70%)' }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-8 blur-3xl" style={{ background: '#9b59b6' }} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full opacity-6 blur-3xl" style={{ background: '#d4a017' }} />
        {rarities.map((r, i) => (
          <div
            key={r.label}
            className="absolute w-1.5 h-1.5 rounded-full animate-float"
            style={{ background: r.color, top: `${15 + i * 20}%`, right: `${8 + i * 5}%`, opacity: 0.5, animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="font-cinzel text-3xl font-black text-gold glow-text-gold tracking-widest group-hover:scale-105 transition-transform">EPIC</span>
            <span className="font-cinzel text-3xl font-black text-white tracking-widest">CLICKER</span>
          </Link>
          <p className="text-white/40 font-rajdhani mt-2 tracking-wide">Твоя легенда начинается здесь</p>
          <div className="flex justify-center mt-3">
            <OnlineBadge />
          </div>
        </div>

        {/* Rarity hint */}
        <div className="flex justify-center gap-2 mb-6">
          {rarities.map((r) => (
            <span key={r.label} className="text-xs font-oswald tracking-widest px-2 py-1 rounded" style={{ color: r.color, background: r.color + '15', border: `1px solid ${r.color}30` }}>
              {r.label}
            </span>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-epic rounded-2xl p-8 border border-gold/15 rune-border">
          <h2 className="font-cinzel text-2xl font-bold text-white text-center mb-2">
            Создать аккаунт
          </h2>
          <p className="text-white/40 text-center font-rajdhani text-sm mb-6">
            Выбери имя для своего героя
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm font-rajdhani flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm font-oswald tracking-widest uppercase mb-2">
                Имя героя
              </label>
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Великий Воин"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-rajdhani focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-all"
                />
              </div>
              <p className="text-white/25 text-xs font-rajdhani mt-1 ml-1">Минимум 3 символа</p>
            </div>

            <div>
              <label className="block text-white/60 text-sm font-oswald tracking-widest uppercase mb-2">
                Email
              </label>
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="hero@epic.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-rajdhani focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm font-oswald tracking-widest uppercase mb-2">
                Пароль
              </label>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-rajdhani focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-all"
                />
              </div>
              <p className="text-white/25 text-xs font-rajdhani mt-1 ml-1">Минимум 6 символов</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-epic py-4 rounded-xl text-base font-cinzel font-bold tracking-wide glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Создаём героя...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Crown" size={18} />
                  Начать приключение
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 font-rajdhani text-sm">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-gold hover:text-gold-light transition-colors font-semibold">
                Войти
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-white/30 hover:text-white/60 text-sm font-rajdhani transition-colors flex items-center justify-center gap-1">
            <Icon name="ArrowLeft" size={14} />
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}