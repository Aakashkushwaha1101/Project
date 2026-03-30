import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const roles = [
  { value: 'citizen',  label: 'Citizen',  icon: '◎', desc: 'Report issues',    color: 'var(--sage)',  bg: 'var(--sage-bg)'  },
  { value: 'official', label: 'Official', icon: '◈', desc: 'Manage & resolve', color: 'var(--clay2)', bg: 'var(--clay-bg)'  },
];

const Register = () => {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'citizen', phone: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      toast.success('Account created', { style: ts });
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', { style: ts });
    } finally { setLoading(false); }
  };

  const fieldStyle = (key) => ({
    width: '100%', padding: '11px 14px', borderRadius: 'var(--r)',
    background: 'rgba(255,248,220,0.03)',
    border: `1px solid ${focused === key ? 'rgba(196,113,74,0.45)' : 'var(--line2)'}`,
    color: 'var(--text)', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === key ? '0 0 0 3px rgba(196,113,74,0.08)' : 'none',
    fontFamily: 'var(--font-body)',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '80px 20px 40px' }}>
      <Toaster position="top-center" />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(107,143,113,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚖</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text)', fontStyle: 'italic' }}>Civic Platform</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--text)', fontWeight: 400, lineHeight: 1.2, marginBottom: '6px' }}>Create account</h1>
          <p style={{ fontSize: '13px', color: 'var(--text3)' }}>Join the platform and make your voice heard</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '28px' }}>
          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={lbl}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {roles.map(r => (
                  <div key={r.value} onClick={() => setForm({ ...form, role: r.value })} style={{
                    padding: '14px 12px', borderRadius: 'var(--r)', cursor: 'pointer',
                    border: `1px solid ${form.role === r.value ? r.color + '60' : 'var(--line)'}`,
                    background: form.role === r.value ? r.bg : 'rgba(255,255,255,0.01)',
                    transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ fontSize: '18px', color: r.color, opacity: form.role === r.value ? 1 : 0.35 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: form.role === r.value ? 'var(--text)' : 'var(--text3)' }}>{r.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '1px' }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Name + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={lbl}>Full name</label>
                <input style={fieldStyle('name')} placeholder="Rahul Sharma"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')} required />
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input style={fieldStyle('phone')} placeholder="9876543210"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={lbl}>Email address</label>
              <input type="email" style={fieldStyle('email')} placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required />
            </div>

            <div style={{ marginBottom: form.role === 'official' ? '14px' : '20px' }}>
              <label style={lbl}>Password</label>
              <input type="password" style={fieldStyle('password')} placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')} required />
            </div>

            {form.role === 'official' && (
              <div style={{ marginBottom: '20px', animation: 'fadeUp 0.3s ease' }}>
                <label style={lbl}>Department</label>
                <select style={{ ...fieldStyle('dept'), cursor: 'pointer' }}
                  value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  onFocus={() => setFocused('dept')} onBlur={() => setFocused('')}>
                  <option value="" style={{ background: '#1c1c18' }}>Select department</option>
                  {['Roads & Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Other'].map(d => (
                    <option key={d} value={d} style={{ background: '#1c1c18' }}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 'var(--r)', border: 'none',
              background: loading ? 'var(--surface3)' : 'var(--clay)',
              color: '#fff8f0', fontSize: '14px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s', fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--clay2)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--clay)'; }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Creating account...
                  </span>
                : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text3)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--clay2)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const lbl = { display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' };
const ts  = { background: '#1c1c18', color: '#f0ebe0', border: '1px solid rgba(255,248,220,0.1)', borderRadius: '10px', fontSize: '13px' };

export default Register;