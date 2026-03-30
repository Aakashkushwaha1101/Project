import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const statusMap = {
  submitted:    { label: 'Submitted',   cls: 'badge-submitted'  },
  assigned:     { label: 'Assigned',    cls: 'badge-assigned'   },
  'in-progress':{ label: 'In Progress', cls: 'badge-inprogress' },
  escalated:    { label: 'Escalated',   cls: 'badge-escalated'  },
  resolved:     { label: 'Resolved',    cls: 'badge-resolved'   },
  closed:       { label: 'Closed',      cls: 'badge-closed'     },
};

const catIcon = { road:'🛣', water:'💧', electricity:'⚡', sanitation:'🗑', other:'◎' };

const StatCard = ({ label, value, color, delay }) => (
  <div className="anim-up" style={{
    padding: '20px 22px', background: 'var(--surface)',
    border: '1px solid var(--line)', borderRadius: 'var(--r-lg)',
    animationDelay: delay + 's',
    transition: 'border-color 0.2s, transform 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)';  e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <p style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{label}</p>
    <p style={{ fontSize: '34px', fontFamily: 'var(--font-display)', color: color, lineHeight: 1 }}>{value}</p>
  </div>
);

const Row = ({ c, isOfficial, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const s = statusMap[c.status] || statusMap.submitted;

  const handleStatus = async (val) => {
    setUpdating(true);
    try {
      await API.put(`/complaints/${c._id}/status`, { status: val });
      onUpdate(c._id, val);
      toast.success('Status updated', { style: ts });
    } catch { toast.error('Failed', { style: ts }); }
    finally { setUpdating(false); }
  };

  return (
    <div style={{
      padding: '14px 18px', borderRadius: 'var(--r-lg)', marginBottom: '8px',
      background: 'var(--surface)', border: '1px solid var(--line)',
      transition: 'border-color 0.18s', display: 'flex', gap: '14px', alignItems: 'flex-start',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--line2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
    >
      {/* Icon */}
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
        {catIcon[c.category] || '◎'}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '3px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{c.title}</span>
          <span className={`badge ${s.cls}`}>{s.label}</span>
          <span className={`badge badge-${c.priority}`}>{c.priority}</span>
          {c.escalationCount > 0 && <span className="badge badge-escalated">Escalated ×{c.escalationCount}</span>}
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>{c.description}</p>
        <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text4)' }}>
          <span>◎ {c.location?.address}</span>
          <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Status dropdown for officials */}
      {isOfficial && (
        <select disabled={updating} value={c.status} onChange={e => handleStatus(e.target.value)} style={{
          padding: '6px 10px', borderRadius: '8px', flexShrink: 0,
          border: '1px solid var(--line2)', background: 'var(--surface2)',
          color: 'var(--text2)', fontSize: '12px', cursor: 'pointer', outline: 'none',
          fontFamily: 'var(--font-body)',
        }}>
          {Object.entries(statusMap).map(([val, { label }]) => (
            <option key={val} value={val} style={{ background: '#1c1c18' }}>{label}</option>
          ))}
        </select>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const url = user.role === 'citizen' ? '/complaints/my' : '/complaints';
        const { data } = await API.get(url);
        setComplaints(data.complaints);
      } catch { toast.error('Failed to load', { style: ts }); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const onUpdate = (id, status) =>
    setComplaints(p => p.map(c => c._id === id ? { ...c, status } : c));

  const stats = {
    total:     complaints.length,
    pending:   complaints.filter(c => ['submitted','assigned','in-progress'].includes(c.status)).length,
    escalated: complaints.filter(c => c.status === 'escalated').length,
    resolved:  complaints.filter(c => ['resolved','closed'].includes(c.status)).length,
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div style={{ paddingTop: '58px', minHeight: '100vh', background: 'var(--bg)' }}>
      <Toaster position="top-right" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div className="anim-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              {user.role === 'citizen' ? 'Citizen portal' : user.role === 'official' ? 'Official dashboard' : 'Admin panel'}
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text)', fontWeight: 400, lineHeight: 1.15 }}>
              Hello, {user.name?.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>Here's the current state of civic complaints</p>
          </div>
          {user.role === 'citizen' && (
            <Link to="/submit" style={{
              padding: '10px 22px', borderRadius: 'var(--r)', textDecoration: 'none',
              background: 'var(--clay)', color: '#fff8f0', fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.02em', transition: 'background 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--clay2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--clay)'}
            >+ Report issue</Link>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '28px' }}>
          <StatCard label="Total"     value={stats.total}     color="var(--text)"  delay={0.05} />
          <StatCard label="Pending"   value={stats.pending}   color="var(--gold2)" delay={0.10} />
          <StatCard label="Escalated" value={stats.escalated} color="var(--clay2)" delay={0.15} />
          <StatCard label="Resolved"  value={stats.resolved}  color="var(--sage2)" delay={0.20} />
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--line)', marginBottom: '20px' }} />

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {['all','submitted','assigned','in-progress','escalated','resolved','closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: '99px', border: `1px solid ${filter === f ? 'var(--line3)' : 'var(--line)'}`,
              background: filter === f ? 'var(--surface2)' : 'transparent',
              color: filter === f ? 'var(--text)' : 'var(--text3)',
              fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              textTransform: 'capitalize', letterSpacing: '0.04em', transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
            }}>{f === 'all' ? `All  (${stats.total})` : f}</button>
          ))}
        </div>

        {/* List */}
        {loading
          ? Array(4).fill(0).map((_,i) => <div key={i} className="skeleton" style={{ height: '78px', marginBottom: '8px' }} />)
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '6px' }}>Nothing here</p>
                <p style={{ fontSize: '13px' }}>
                  {user.role === 'citizen'
                    ? <Link to="/submit" style={{ color: 'var(--clay2)' }}>Submit your first complaint →</Link>
                    : 'No complaints in this category'}
                </p>
              </div>
            : filtered.map(c => <Row key={c._id} c={c} isOfficial={user.role !== 'citizen'} onUpdate={onUpdate} />)
        }
      </div>
    </div>
  );
};

const ts = { background: '#1c1c18', color: '#f0ebe0', border: '1px solid rgba(255,248,220,0.1)', borderRadius: '10px', fontSize: '13px' };

export default Dashboard;