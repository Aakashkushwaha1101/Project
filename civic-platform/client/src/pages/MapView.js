import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../api/axios';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colored markers
const createIcon = (color) => L.divIcon({
  className: '',
  html: `
    <div style="
      width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
      background: ${color}; border: 3px solid white;
      transform: rotate(-45deg);
      box-shadow: 0 4px 15px ${color}80;
    "></div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const statusColors = {
  submitted:    '#94a3b8',
  assigned:     '#60a5fa',
  'in-progress':'#a78bfa',
  escalated:    '#f87171',
  resolved:     '#34d399',
  closed:       '#6ee7b7',
};

const catIcons = {
  road: '🛣️', water: '💧', electricity: '⚡', sanitation: '🗑️', other: '📋'
};

const MapView = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  // Mathura center
  const center = [27.4924, 77.6737];

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/complaints');
        setComplaints(data.complaints);
      } catch {
        // citizen fallback
        try {
          const { data } = await API.get('/complaints/my');
          setComplaints(data.complaints);
        } catch (e) {
          console.log(e);
        }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = filter === 'all'
    ? complaints
    : complaints.filter(c => c.status === filter);

  const withCoords = filtered.filter(c => c.location?.lat && c.location?.lng);
  const withoutCoords = filtered.filter(c => !c.location?.lat || !c.location?.lng);

  const stats = {
    total: complaints.length,
    escalated: complaints.filter(c => c.status === 'escalated').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    pending: complaints.filter(c => ['submitted', 'assigned', 'in-progress'].includes(c.status)).length,
  };

  return (
    <div style={{ paddingTop: '64px', height: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,179,237,0.1)', flexShrink: 0,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🗺️</div>
          <div>
            <h2 style={{ fontFamily: 'Sora', fontSize: '15px', color: '#f1f5f9', fontWeight: 700 }}>Complaint Heatmap</h2>
            <p style={{ fontSize: '11px', color: '#64748b' }}>{withCoords.length} complaints on map</p>
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'Total', value: stats.total, color: '#60a5fa' },
            { label: 'Pending', value: stats.pending, color: '#fcd34d' },
            { label: 'Escalated', value: stats.escalated, color: '#f87171' },
            { label: 'Resolved', value: stats.resolved, color: '#34d399' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '6px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.1)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: s.color, fontFamily: 'Sora' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {['all', 'submitted', 'assigned', 'in-progress', 'escalated', 'resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: '99px', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
              background: filter === f ? statusColors[f] || '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: filter === f ? 'white' : '#64748b',
              boxShadow: filter === f ? `0 0 12px ${statusColors[f] || '#3b82f6'}60` : 'none',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* MAP */}
        <div style={{ flex: 1, position: 'relative' }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(99,179,237,0.2)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <p style={{ color: '#64748b', fontSize: '14px' }}>Loading map...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={center} zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />

              {withCoords.map(c => (
                <Marker
                  key={c._id}
                  position={[c.location.lat, c.location.lng]}
                  icon={createIcon(statusColors[c.status] || '#94a3b8')}
                  eventHandlers={{ click: () => setSelected(c) }}
                >
                  <Popup>
                    <div style={{ minWidth: '200px', fontFamily: 'DM Sans, sans-serif' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{catIcons[c.category]}</span>
                        <strong style={{ fontSize: '14px' }}>{c.title}</strong>
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>{c.description?.slice(0, 80)}...</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: statusColors[c.status] + '25', color: statusColors[c.status], textTransform: 'uppercase' }}>{c.status}</span>
                        <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', background: '#f0f0f0', color: '#666' }}>{c.category}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>📍 {c.location.address}</p>
                    </div>
                  </Popup>

                  {/* Pulse circle for escalated */}
                  {c.status === 'escalated' && (
                    <Circle
                      center={[c.location.lat, c.location.lng]}
                      radius={100}
                      pathOptions={{ color: '#f87171', fillColor: '#f87171', fillOpacity: 0.1, weight: 1 }}
                    />
                  )}
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
            background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(99,179,237,0.15)', borderRadius: '14px', padding: '14px 16px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Legend</p>
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar — complaints without coords */}
        {withoutCoords.length > 0 && (
          <div style={{
            width: '280px', overflowY: 'auto', flexShrink: 0,
            background: 'rgba(10,15,30,0.95)', borderLeft: '1px solid rgba(99,179,237,0.1)',
            padding: '16px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              📍 No coordinates ({withoutCoords.length})
            </p>
            {withoutCoords.map(c => (
              <div key={c._id} style={{
                padding: '12px', borderRadius: '12px', marginBottom: '8px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,179,237,0.08)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.08)'}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '16px' }}>{catIcons[c.category]}</span>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>{c.title}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>{c.location?.address}</p>
                    <div style={{ marginTop: '6px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: statusColors[c.status] + '20', color: statusColors[c.status], textTransform: 'uppercase' }}>{c.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;