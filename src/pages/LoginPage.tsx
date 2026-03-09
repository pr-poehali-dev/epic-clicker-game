import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiLogin } from '@/api/auth';
import Icon from '@/components/ui/icon';
import OnlineBadge from '@/components/game/OnlineBadge';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email, password);
      login(token, user);
      navigate('/game');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at top, #1A1A2E 0%, #0A0A0F 70%)' }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{ background: '#d4a017' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-5 blur-3xl" style={{ background: '#cc2200' }} />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/40 animate-pulse"
            style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 13}%`,
              animationDelay: `${i * 0.4}s`,
            }}
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
          <p className="text-white/40 font-rajdhani mt-2 tracking-wide">Возвращайся, воин</p>
          <div className="flex justify-center mt-3">
            <OnlineBadge />
          </div>
        </div>

        {/* Form Card */}
        <div className="card-epic rounded-2xl p-8 border border-gold/15 rune-border">
          <h2 className="font-cinzel text-2xl font-bold text-white text-center mb-6">
            Вход в аккаунт
          </h2>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm font-rajdhani flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-epic py-4 rounded-xl text-base font-cinzel font-bold tracking-wide glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Входим...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Swords" size={18} />
                  Войти в игру
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40 font-rajdhani text-sm">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-gold hover:text-gold-light transition-colors font-semibold">
                Зарегистрироваться
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