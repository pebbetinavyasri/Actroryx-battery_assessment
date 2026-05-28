import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Icon } from './UI';
import { ICONS, BATTERY } from '../utils/constants';

const TABS = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/inspect', label: 'Inspect', icon: 'zap' },
  { path: '/history', label: 'History', icon: 'history' },
  { path: '/chat', label: 'AI Chat', icon: 'chat' },
];

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <>
      {/* Top header */}
      <div style={{ background: 'linear-gradient(90deg,#0f172a,#1e293b)',
        borderBottom: '1px solid #1e293b', padding: '0 32px',
        display: 'flex', alignItems: 'center', gap: 20, height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.battery} size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>BatteryQC Pro</div>
            <div style={{ fontSize: 10, color: '#6366f1', letterSpacing: 1 }}>INSPECTION SYSTEM</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#475569' }}>
          {BATTERY.voltage}V • {BATTERY.type} • {BATTERY.capacity} Ah
        </div>
        <div style={{ width: 1, height: 32, background: '#1e293b' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>System Active</span>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e293b',
        padding: '0 32px', display: 'flex', gap: 4, position: 'sticky', top: 64, zIndex: 99 }}>
        {TABS.map(t => {
          const active = pathname === t.path;
          return (
            <Link key={t.path} to={t.path} style={{ textDecoration: 'none' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 18px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${active ? '#6366f1' : 'transparent'}`,
                color: active ? '#818cf8' : '#64748b',
                fontSize: 13.5, fontWeight: active ? 600 : 400, transition: 'all .2s' }}>
                <Icon d={ICONS[t.icon]} size={16} color={active ? '#818cf8' : '#64748b'} />
                {t.label}
              </button>
            </Link>
          );
        })}
      </div>
    </>
  );
}
