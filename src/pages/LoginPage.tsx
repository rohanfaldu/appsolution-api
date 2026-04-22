import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(credentials);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: '#f7f7f2',
        backgroundImage: 'radial-gradient(#adada9 1px, transparent 1px)',
        backgroundSize: '26px 26px',
      }}
    >
      <main className="w-full max-w-[480px] z-10">
        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 border border-outline-variant/10 shadow-[0_20px_40px_rgba(45,47,44,0.05)]">
          {/* Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary-fixed text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">APPFORGE</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl text-on-surface text-center tracking-tight">Welcome Back</h1>
            <p className="text-on-surface-variant mt-2 text-center">Continue your architectural journey.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-medium">Email Address</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="architect@appforge.dev"
                className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 px-0 py-3 focus:outline-none focus:border-primary-fixed transition-all duration-300 font-body placeholder:text-outline-variant/50"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-medium">Password</label>
                <a href="#" className="font-label text-[10px] uppercase tracking-tighter text-primary hover:text-primary-dim transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 px-0 py-3 pr-8 focus:outline-none focus:border-primary-fixed transition-all duration-300 font-body placeholder:text-outline-variant/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-headline font-bold py-4 rounded-lg transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Logging In...' : 'Log In'}
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-surface-container-lowest font-label text-on-surface-variant uppercase tracking-widest">Or connect with</span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-lg opacity-70 group-hover:opacity-100">terminal</span>
              <span className="font-label text-xs font-bold text-on-surface">GITHUB</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/20 rounded-lg hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-lg opacity-70 group-hover:opacity-100">language</span>
              <span className="font-label text-xs font-bold text-on-surface">GOOGLE</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-on-surface-variant">
              New to the forge?{' '}
              <Link to="/signup" className="text-on-surface font-bold hover:text-primary transition-colors ml-1">
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-fixed" />
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">System Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-outline-variant" />
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">v4.0.2-stable</span>
          </div>
        </div>
      </main>

      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-primary-fixed/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-primary-fixed/10 blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
};

export default LoginPage;
