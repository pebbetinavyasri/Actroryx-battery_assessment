import React from 'react';
import { STATUS, ICONS, LIMITS } from '../utils/constants';

/* ─── Icon ─── */
export function Icon({ d, size = 20, color = 'currentColor', strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/* ─── StatusBadge ─── */
export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.idle;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 1,
      color: s.color, background: s.color + '18',
      padding: '3px 10px', borderRadius: 20,
      border: `1px solid ${s.border}44`,
    }}>{s.label}</span>
  );
}

/* ─── StatCard ─── */
export function StatCard({ label, value, unit, status, icon, onClick }) {
  const s = STATUS[status] || STATUS.idle;
  return (
    <div onClick={onClick} style={{
      background: 'linear-gradient(135deg,#1e293b,#0f172a)',
      border: `1px solid ${s.border}22`, borderRadius: 16,
      padding: '20px 24px', cursor: onClick ? 'pointer' : 'default',
      transition: 'transform .2s,box-shadow .2s', position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${s.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${s.color}11` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ padding: 8, borderRadius: 10, background: `${s.color}18` }}>
          <Icon d={ICONS[icon]} size={18} color={s.color} />
        </div>
        <StatusBadge status={status} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1 }}>
        {value}<span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 4 }}>{unit}</span>
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ─── BatteryVisual ─── */
export function BatteryVisual({ voltage, hasCrack }) {
  const vPct = Math.max(0, Math.min(100, ((voltage - 2.5) / (4.2 - 2.5)) * 100));
  const fillColor = voltage >= 3.5 ? '#22c55e' : voltage >= 3.0 ? '#f59e0b' : '#ef4444';
  const bars = Math.round(vPct / 25);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width="120" height="200" viewBox="0 0 120 200">
        <rect x="35" y="4" width="50" height="12" rx="4" fill="#374151" />
        <rect x="10" y="16" width="100" height="168" rx="12" fill="#1f2937" stroke="#374151" strokeWidth="2" />
        <rect x="14" y={20 + 160 * (1 - vPct / 100)} width="92" height={160 * vPct / 100} rx="8" fill={fillColor} opacity=".9" />
        {hasCrack && (
          <path d="M40 60 L55 90 L48 110 L65 150" stroke="#ef4444" strokeWidth="2.5"
            fill="none" strokeLinecap="round" strokeDasharray="4 2" />
        )}
        <text x="60" y="108" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{voltage}V</text>
        <text x="60" y="126" textAnchor="middle" fill="#9ca3af" fontSize="11">{vPct.toFixed(0)}%</text>
      </svg>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 14, height: 28, borderRadius: 4,
            background: i < bars ? fillColor : '#374151', transition: 'background .3s' }} />
        ))}
      </div>
    </div>
  );
}

/* ─── GaugeChart ─── */
export function GaugeChart({ value, min, max, threshold, label, unit, reverse = false }) {
  const pct = (value - min) / (max - min);
  const angle = -135 + pct * 270;
  const cx = 80, cy = 80, r = 56;
  const rad = (d) => (d * Math.PI) / 180;
  const nx = cx + r * 0.75 * Math.cos(rad(angle - 90));
  const ny = cy + r * 0.75 * Math.sin(rad(angle - 90));
  const isGood = reverse ? value <= threshold : value >= threshold;
  const color = isGood ? '#22c55e' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="160" height="120" viewBox="0 0 160 120">
        <path d={`M ${cx - r * Math.cos(rad(45))} ${cy + r * Math.sin(rad(45))} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(rad(45))} ${cy + r * Math.sin(rad(45))}`}
          stroke="#374151" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={`M ${cx - r * Math.cos(rad(45))} ${cy + r * Math.sin(rad(45))} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${nx} ${ny}`}
          stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx={nx} cy={ny} r="5" fill={color} />
        <circle cx={cx} cy={cy} r="6" fill="#1f2937" stroke={color} strokeWidth="2" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="16" fontWeight="700">{value}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#9ca3af" fontSize="9">{unit}</text>
        <text x={cx} y={107} textAnchor="middle" fill="#9ca3af" fontSize="10">{label}</text>
      </svg>
    </div>
  );
}

/* ─── LoadingSpinner ─── */
export function LoadingSpinner({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* ─── Card wrapper ─── */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#1e293b,#0f172a)',
      border: '1px solid #334155', borderRadius: 20, padding: 28,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Section heading ─── */
export function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#64748b', marginBottom: 16 }}>
      {children}
    </div>
  );
}

/* ─── Criteria list ─── */
export function CriteriaList() {
  const items = [
    { label: 'Voltage', rule: `> ${LIMITS.voltageMin} V`, icon: 'voltage', color: '#22c55e' },
    { label: 'Temperature', rule: `< ${LIMITS.tempMax} °C`, icon: 'temp', color: '#f59e0b' },
    { label: 'Impedance', rule: `< ${LIMITS.impedanceMax} Ω`, icon: 'impedance', color: '#6366f1' },
    { label: 'No cracks / leaks', rule: 'Physical inspection', icon: 'crack', color: '#ec4899' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {items.map(({ label, rule, icon, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', background: '#0f172a', borderRadius: 10, border: '1px solid #1e293b' }}>
          <Icon d={ICONS[icon]} size={16} color={color} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{label}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{rule}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
