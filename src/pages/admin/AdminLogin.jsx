import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import logo from '../../assets/site_logo_v2.png';

const ADMIN_AUTH_KEY = 'adminAuthenticated';

function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

function setAdminAuthenticated(value) {
  localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false');
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.status === 202) {
        setSuccessMessage(data.message || 'A setup link has been sent to your email.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const message = data?.message || 'Login failed. Please check credentials.';
        setError(message);
        setLoading(false);
        return;
      }

      const token = data?.token || data?.accessToken || null;
      if (!token) {
        setError('Login succeeded but no token returned by server.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', token);
      setAdminAuthenticated(true);
      setLoading(false);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-hidden">
        <div className="px-8 pt-12 pb-10 sm:px-12">
          
          <div className="flex justify-center mb-10">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <img src={logo} alt="Vaishnavi Homeo Care" className="h-12 object-contain" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Admin Portal</h1>
            <p className="text-slate-500 text-sm leading-relaxed px-4">
              Authorized access only. Please sign in to manage your clinical dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-2xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 px-5 py-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@vaishnavihomeocare.com"
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 transition-all focus:bg-white focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 transition-all focus:bg-white focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 pr-14"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-100"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-4 text-white text-base font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock size={18} />
                    <span>Secure Login</span>
                  </div>
                )}
              </button>
          </form>
        </div>
        
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Vaishnavi Homeo Care. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

