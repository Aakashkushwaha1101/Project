import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      toast.success('Welcome back', { style: ts });
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', { style: ts });
    } finally { setLoading(false); }
  };

  const field = (key, type, placeholder) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={lbl}>{key === 'email' ? 'Email address' : 'Password'}</label>
      <input
        type={type} placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        onFocus={() => setFocused(key)} onBlur={() => setFocused('')}
        required
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 'var(--r)',
          background: 'rgba(255,248,220,0.03)',
          border: `1px solid ${focused === key ? 'rgba(196,113,74,0.45)' : 'var(--line2)'}`,
          color: 'var(--text)', fontSize: '14px', outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused === key ? '0 0 0 3px rgba(196,113,74,0.08)' : 'none',
          fontFamily: 'var(--font-body)',
        }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' }}>
      <Toaster position="top-center" />

      {/* Subtle warm glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(196,113,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚖</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text)', fontStyle: 'italic' }}>Civic Platform</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--text)', fontWeight: 400, lineHeight: 1.2, marginBottom: '6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '28px' }}>
          <form onSubmit={handleSubmit}>
            {field('email', 'email', 'you@example.com')}
            {field('password', 'password', '••••••••')}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 'var(--r)',
              background: loading ? 'var(--surface3)' : 'var(--clay)',
              border: 'none', color: '#fff8f0', fontSize: '14px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
              transition: 'background 0.2s', fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--clay2)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--clay)'; }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Signing in...
                  </span>
                : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text3)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--clay2)', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const lbl = { display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' };
const ts  = { background: '#1c1c18', color: '#f0ebe0', border: '1px solid rgba(255,248,220,0.1)', borderRadius: '10px', fontSize: '13px' };

export default Login;