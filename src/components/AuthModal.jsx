import { useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthModal = ({ t, mode: initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState(initialMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      setError(authError.message);
    } else {
      onSuccess?.();
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (authError) {
      setError(authError.message);
    } else {
      if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, name });
      }
      onSuccess?.();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (authError) setError(authError.message);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-sm">
        <div className="bg-throne-red text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-wide">
            {mode === 'login' ? t('auth.logIn') : t('auth.createAccount')}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-red-100 text-throne-red p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 p-3 font-bold text-sm mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t('auth.continueWithGoogle')}
          </button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">{t('auth.or')}</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            {mode === 'signup' && (
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  {t('auth.name').toUpperCase()}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-black p-3 text-sm"
                  placeholder={t('auth.namePlaceholder')}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 block mb-1">
                {t('auth.email').toUpperCase()}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 text-sm"
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 block mb-1">
                {t('auth.password').toUpperCase()}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 text-sm"
                placeholder={t('auth.passwordPlaceholder')}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-3 font-bold text-sm disabled:bg-gray-400 hover:bg-gray-800 transition-colors"
            >
              {loading 
                ? t('common.loading') 
                : mode === 'login' 
                  ? t('auth.logIn') 
                  : t('auth.createAccount')
              }
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="font-bold text-throne-red hover:underline"
              >
                {mode === 'login' ? t('auth.signUp') : t('auth.logIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
