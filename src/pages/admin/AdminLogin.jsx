import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../api/endpoints';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError('');

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

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    if (otp !== generatedOtp) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError('Invalid OTP. Please try again.');

      if (nextAttempts >= 3) {
        setEmail('');
        setPassword('');
        setGeneratedOtp('');
        setOtp('');
        setStep('credentials');
        setAttempts(0);
        setError('Too many failed OTP attempts. Please login again.');
      }
      return;
    }

    setAdminAuthenticated(true);
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-10 sm:px-10">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Admin Login</h1>
          <p className="text-sm text-slate-500 mb-8">
            Enter your admin email and password to request an OTP. After verification, you will be redirected to the dashboard.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSendOtp}>
              <label className="block mb-4">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  className="mt-2 block w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="block mb-6">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className="mt-2 block w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-white text-sm font-semibold shadow-sm hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
          </form>

          <p className="text-xs text-slate-400 mt-8">
            Note: This form submits your email and password to the server for authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
