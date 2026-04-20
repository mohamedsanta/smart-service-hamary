import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LanguageToggle } from '../components/shared/LanguageToggle';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError(isAr ? 'بيانات دخول غير صحيحة' : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className={`mb-8 ${isAr ? 'text-right' : 'text-center'}`}>
          <h1 className="text-3xl font-display font-black text-cream mb-2">{t('admin.login')}</h1>
          <p className="text-cream/50 font-inter text-sm">{isAr ? company_name_ar : 'Smart Service'}</p>
        </div>

        <form onSubmit={submit} className="card bg-cream-deep space-y-4">
          <div>
            <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('admin.username')}</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="input w-full" dir="ltr" required />
          </div>
          <div>
            <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('admin.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" dir="ltr" required />
          </div>
          {error && <p className="text-red-600 text-sm font-inter">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('admin.sign_in')}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <LanguageToggle className="text-cream/40 border-cream/20" />
        </div>
      </div>
    </div>
  );
}

const company_name_ar = 'سمارت سيرفس';
