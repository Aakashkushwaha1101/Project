import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

const cats = [
  { value: 'road',        icon: '🛣', label: 'Road'        },
  { value: 'water',       icon: '💧', label: 'Water'       },
  { value: 'electricity', icon: '⚡', label: 'Electricity' },
  { value: 'sanitation',  icon: '🗑', label: 'Sanitation'  },
  { value: 'other',       icon: '◎', label: 'Other'       },
];

const prios = [
  { value: 'low',    label: 'Low',    color: 'var(--sage2)' },
  { value: 'medium', label: 'Medium', color: 'var(--gold2)' },
  { value: 'high',   label: 'High',   color: 'var(--clay2)' },
];

const SubmitComplaint = () => {
  const [form, setForm]     = useState({ title: '', description: '', category: 'road', priority: 'medium', location: { address: '', lat: '', lng: '' } });
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/complaints', form);
      toast.success('Complaint submitted', { style: ts });
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed', { style: ts });
    } finally { setLoading(false); }
  };

  const fs = (key) => ({
    width: '100%', padding: '11px 14px', borderRadius: 'var(--r)',
    background: 'rgba(255,248,220,0.03)',
    border: `1px solid ${focused === key ? 'rgba(196,113,74,0.45)' : 'var(--line2)'}`,
    color: 'var(--text)', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === key ? '0 0 0 3px rgba(196,113,74,0.08)' : 'none',
    fontFamily: 'var(--font-body)',
  });

  const steps = ['Issue', 'Location', 'Review'];

  return (
    <div style={{ paddingTop: '58px', minHeight: '100vh', background: 'var(--bg)', padding: '96px 20px 40px' }}>
      <Toaster position="top-center" />
      <div style={{ position: 'fixed', top: '25%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(184,150,62,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '580px', margin: '0 auto' }}>

        {/* Header */}
        <div className="anim-up" style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>New report</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 400, color: 'var(--text)' }}>Submit a complaint</h1>
        </div>

        {/* Step indicators */}
        <div className="anim-up" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', animationDelay: '0.05s' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, transition: 'all 0.25s',
                background: step > i+1 ? 'var(--sage)' : step === i+1 ? 'var(--clay)' : 'var(--surface2)',
                color: step >= i+1 ? '#fff8f0' : 'var(--text3)',
                border: step === i+1 ? 'none' : '1px solid var(--line2)',
              }}>{step > i+1 ? '✓' : i+1}</div>
              <span style={{ fontSize: '12px', color: step === i+1 ? 'var(--text)' : 'var(--text4)', fontWeight: step === i+1 ? 600 : 400 }}>{s}</span>
              {i < 2 && <div style={{ width: 24, height: '1px', background: step > i+1 ? 'var(--sage)' : 'var(--line)' }} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit}>
          <div className="anim-up" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '26px', animationDelay: '0.1s' }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                <p style={secTitle}>Category</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '7px', marginBottom: '20px' }}>
                  {cats.map(c => (
                    <div key={c.value} onClick={() => setForm({ ...form, category: c.value })} style={{
                      padding: '12px 6px', borderRadius: 'var(--r)', cursor: 'pointer', textAlign: 'center',
                      border: `1px solid ${form.category === c.value ? 'rgba(196,113,74,0.4)' : 'var(--line)'}`,
                      background: form.category === c.value ? 'var(--clay-bg)' : 'rgba(255,255,255,0.01)',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.icon}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: form.category === c.value ? 'var(--clay2)' : 'var(--text3)', letterSpacing: '0.04em' }}>{c.label}</div>
                    </div>
                  ))}
                </div>

                <p style={secTitle}>Priority</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {prios.map(p => (
                    <div key={p.value} onClick={() => setForm({ ...form, priority: p.value })} style={{
                      padding: '10px 12px', borderRadius: 'var(--r)', cursor: 'pointer',
                      border: `1px solid ${form.priority === p.value ? p.color + '50' : 'var(--line)'}`,
                      background: form.priority === p.value ? p.color + '12' : 'rgba(255,255,255,0.01)',
                      transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, flexShrink: 0, opacity: form.priority === p.value ? 1 : 0.35 }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: form.priority === p.value ? 'var(--text)' : 'var(--text3)' }}>{p.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Title</label>
                  <input style={fs('title')} placeholder="Brief title of the issue"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    onFocus={() => setFocused('title')} onBlur={() => setFocused('')} required />
                </div>

                <div>
                  <label style={lbl}>Description</label>
                  <textarea style={{ ...fs('desc'), resize: 'vertical', minHeight: '90px', lineHeight: 1.6 }}
                    placeholder="Describe the issue in detail..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    onFocus={() => setFocused('desc')} onBlur={() => setFocused('')} required />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Full address</label>
                  <input style={fs('addr')} placeholder="e.g. Bus Stand Road, Mathura, UP"
                    value={form.location.address} onChange={e => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
                    onFocus={() => setFocused('addr')} onBlur={() => setFocused('')} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={lbl}>Latitude</label>
                    <input type="number" step="any" style={fs('lat')} placeholder="27.4924"
                      value={form.location.lat} onChange={e => setForm({ ...form, location: { ...form.location, lat: e.target.value } })}
                      onFocus={() => setFocused('lat')} onBlur={() => setFocused('')} />
                  </div>
                  <div>
                    <label style={lbl}>Longitude</label>
                    <input type="number" step="any" style={fs('lng')} placeholder="77.6737"
                      value={form.location.lng} onChange={e => setForm({ ...form, location: { ...form.location, lng: e.target.value } })}
                      onFocus={() => setFocused('lng')} onBlur={() => setFocused('')} />
                  </div>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 'var(--r)', background: 'var(--gold-bg)', border: '1px solid rgba(184,150,62,0.2)', fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6 }}>
                  Tip — Right-click any location on Google Maps to copy its coordinates.
                </div>
              </div>
            )}

            {/* STEP 3 — Review */}
            {step === 3 && (
              <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                <p style={{ ...secTitle, marginBottom: '16px' }}>Review before submitting</p>
                {[
                  ['Category',    form.category],
                  ['Priority',    form.priority],
                  ['Title',       form.title],
                  ['Description', form.description],
                  ['Address',     form.location.address],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '14px', padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', width: '80px', flexShrink: 0, paddingTop: '1px' }}>{k}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div className="anim-up" style={{ display: 'flex', gap: '8px', marginTop: '12px', animationDelay: '0.15s' }}>
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s-1)} style={{
                flex: 1, padding: '12px', borderRadius: 'var(--r)',
                border: '1px solid var(--line2)', background: 'transparent',
                color: 'var(--text3)', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                transition: 'border-color 0.15s', fontFamily: 'var(--font-body)',
              }}>← Back</button>
            )}
            {step < 3
              ? <button type="button" onClick={() => setStep(s => s+1)}
                  disabled={step === 1 && (!form.title || !form.description)}
                  style={{ flex: 2, padding: '12px', borderRadius: 'var(--r)', border: 'none', background: 'var(--clay)', color: '#fff8f0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.18s', fontFamily: 'var(--font-body)', opacity: step===1 && (!form.title||!form.description) ? 0.4 : 1 }}
                  onMouseEnter={e => { if (form.title && form.description) e.currentTarget.style.background = 'var(--clay2)'; }}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--clay)'}
                >Continue →</button>
              : <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 'var(--r)', border: 'none', background: loading ? 'var(--surface3)' : 'var(--sage)', color: '#f0ebe0', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.18s' }}>
                  {loading ? 'Submitting...' : '✓ Submit complaint'}
                </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

const lbl      = { display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' };
const secTitle = { fontSize: '11px', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' };
const ts       = { background: '#1c1c18', color: '#f0ebe0', border: '1px solid rgba(255,248,220,0.1)', borderRadius: '10px', fontSize: '13px' };

export default SubmitComplaint;