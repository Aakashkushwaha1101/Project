import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const active = (p) => location.pathname === p;

  const navLink = (to, label) => (
    <Link to={to} style={{
      padding: '6px 13px', borderRadius: '8px', textDecoration: 'none',
      fontSize: '13px', fontWeight: 500, transition: 'all 0.18s',
      color: active(to) ? '#f0ebe0' : '#6a6458',
      background: active(to) ? 'rgba(255,248,220,0.07)' : 'transparent',
      letterSpacing: '0.01em',
    }}
      onMouseEnter={e => { if (!active(to)) e.currentTarget.style.color = '#a09880'; }}
      onMouseLeave={e => { if (!active(to)) e.currentTarget.style.color = '#6a6458'; }}
    >{label}</Link>
  );

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '58px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 28px',
      background: scrolled ? 'rgba(14,14,12,0.94)' : 'rgba(14,14,12,0.5)',
      backdropFilter: 'blur(18px)',
      borderBottom: scrolled ? '1px solid rgba(255,248,220,0.07)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: '8px',
          background: 'var(--clay)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
        }}>⚖</div>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text)', fontStyle: 'italic', letterSpacing: '0.01em' }}>Civic</span>
          <span style={{ fontSize: '12px', color: 'var(--text3)', marginLeft: '4px', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Platform</span>
        </div>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {user ? (
          <>
            {navLink('/dashboard', 'Dashboard')}
            {user.role === 'citizen' && navLink('/submit', 'Report Issue')}
            {navLink('/map', 'Map')}

            {/* Divider */}
            <div style={{ width: '1px', height: '18px', background: 'var(--line2)', margin: '0 8px' }} />

            {/* User chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 10px 5px 6px', borderRadius: '99px',
              background: 'var(--surface)', border: '1px solid var(--line2)',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--clay-bg2)', border: '1px solid var(--clay)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: 'var(--clay3)',
              }}>{user.name?.[0]?.toUpperCase()}</div>
              <span style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 500 }}>
                {user.name?.split(' ')[0]}
              </span>
              <span style={{
                fontSize: '9px', padding: '2px 6px', borderRadius: '99px',
                background: user.role === 'admin' ? 'var(--gold-bg)' : user.role === 'official' ? 'var(--clay-bg)' : 'var(--sage-bg)',
                color: user.role === 'admin' ? 'var(--gold2)' : user.role === 'official' ? 'var(--clay2)' : 'var(--sage2)',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>{user.role}</span>
            </div>

            <button onClick={handleLogout} style={{
              marginLeft: '6px', padding: '6px 14px', borderRadius: '8px',
              background: 'transparent', border: '1px solid var(--line2)',
              color: 'var(--text3)', cursor: 'pointer', fontSize: '12px',
              fontWeight: 500, transition: 'all 0.18s', fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,113,74,0.35)'; e.currentTarget.style.color = 'var(--clay2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line2)'; e.currentTarget.style.color = 'var(--text3)'; }}
            >Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text3)', fontSize: '13px', fontWeight: 500, transition: 'color 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
            >Sign in</Link>
            <Link to="/register" style={{
              padding: '7px 18px', borderRadius: '8px', textDecoration: 'none',
              background: 'var(--clay)', color: '#fff8f0',
              fontSize: '13px', fontWeight: 600, transition: 'background 0.18s',
              letterSpacing: '0.01em',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--clay2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--clay)'}
            >Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;