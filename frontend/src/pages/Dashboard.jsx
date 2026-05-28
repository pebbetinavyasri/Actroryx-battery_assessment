import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';
import { StatCard, BatteryVisual, Card, SectionLabel, CriteriaList, Icon } from '../components/UI';
import { ICONS, BATTERY, LIMITS, STATUS } from '../utils/constants';
import { format } from 'date-fns';

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10,
      padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>{d.label}</div>
      <div style={{ color: 'white' }}>Mean: <strong style={{ color: d.color }}>{d.mean} {d.unit}</strong></div>
      <div style={{ color: '#64748b' }}>Threshold: {d.thresholdLabel}</div>
      <div style={{ color: '#64748b' }}>Records: {d.count}</div>
    </div>
  );
}

/* ── Mean Bar Chart ── */
function MeanBarChart({ records }) {
  if (!records.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: 180, color: '#475569', gap: 8 }}>
        <Icon d={ICONS.history} size={28} color="#334155" />
        <div style={{ fontSize: 13 }}>Add inspections to see averages</div>
      </div>
    );
  }

  const avg = (key) => {
    const vals = records.map(r => r[key]).filter(v => typeof v === 'number');
    return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3)) : 0;
  };

  const meanV   = avg('voltage');
  const meanT   = avg('temperature');
  const meanImp = avg('impedance');

  const data = [
    {
      name: 'Voltage',
      label: 'Average Voltage',
      mean: meanV,
      unit: 'V',
      threshold: LIMITS.voltageMin,
      thresholdLabel: `> ${LIMITS.voltageMin} V`,
      // normalise to 0–100 scale for display
      display: parseFloat(((meanV / 4.2) * 100).toFixed(1)),
      thresholdDisplay: parseFloat(((LIMITS.voltageMin / 4.2) * 100).toFixed(1)),
      color: meanV > LIMITS.voltageMin ? '#22c55e' : '#ef4444',
      count: records.length,
    },
    {
      name: 'Temperature',
      label: 'Average Temperature',
      mean: meanT,
      unit: '°C',
      threshold: LIMITS.tempMax,
      thresholdLabel: `< ${LIMITS.tempMax} °C`,
      display: parseFloat(((meanT / 100) * 100).toFixed(1)),
      thresholdDisplay: LIMITS.tempMax,
      color: meanT < LIMITS.tempMax ? '#22c55e' : '#ef4444',
      count: records.length,
    },
    {
      name: 'Impedance',
      label: 'Average Impedance',
      mean: meanImp,
      unit: 'Ω',
      threshold: LIMITS.impedanceMax,
      thresholdLabel: `< ${LIMITS.impedanceMax} Ω`,
      display: parseFloat(((meanImp / 0.15) * 100).toFixed(1)),
      thresholdDisplay: parseFloat(((LIMITS.impedanceMax / 0.15) * 100).toFixed(1)),
      color: meanImp < LIMITS.impedanceMax ? '#22c55e' : '#ef4444',
      count: records.length,
    },
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }} barSize={48}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
            domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Bar dataKey="display" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
          {/* Threshold lines per bar — use average threshold position */}
          <ReferenceLine y={data[0].thresholdDisplay} stroke="#6366f144" strokeDasharray="4 3" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend row */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ color: '#64748b' }}>{d.name}:</span>
            <span style={{ color: 'white', fontWeight: 700 }}>{d.mean} {d.unit}</span>
            <span style={{ color: d.color, fontSize: 10 }}>
              {d.name === 'Voltage'
                ? (d.mean > d.threshold ? '▲ OK' : '▼ LOW')
                : (d.mean < d.threshold ? '▼ OK' : '▲ HIGH')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recent table ── */
function RecentTable({ records }) {
  if (!records.length) return (
    <div style={{ textAlign: 'center', padding: 32, color: '#475569' }}>
      <Icon d={ICONS.history} size={32} color="#334155" />
      <div style={{ marginTop: 8, fontSize: 14 }}>No inspections yet</div>
    </div>
  );
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1e293b' }}>
          {['Time', 'Voltage', 'Temp', 'Impedance', 'Physical', 'Result'].map(h => (
            <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>{h.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.slice(0, 6).map((r, i) => {
          const s = STATUS[r.overall];
          return (
            <tr key={r._id || i} style={{ borderBottom: '1px solid #0f172a', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e293b44'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '10px 14px', color: '#94a3b8' }}>
                {r.createdAt ? format(new Date(r.createdAt), 'HH:mm:ss') : '–'}
              </td>
              <td style={{ padding: '10px 14px', color: r.checks?.voltage === 'pass' ? '#22c55e' : '#ef4444' }}>{r.voltage}V</td>
              <td style={{ padding: '10px 14px', color: r.checks?.temperature === 'pass' ? '#22c55e' : '#ef4444' }}>{r.temperature}°C</td>
              <td style={{ padding: '10px 14px', color: r.checks?.impedance === 'pass' ? '#22c55e' : '#ef4444' }}>{r.impedance}Ω</td>
              <td style={{ padding: '10px 14px', color: r.checks?.crack === 'pass' ? '#22c55e' : '#ef4444' }}>
                {r.hasCrack ? '⚠ Damage' : '✓ Clear'}
              </td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.color,
                  background: `${s.color}18`, padding: '3px 10px', borderRadius: 20 }}>{s.label}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ── Dashboard ── */
export default function Dashboard({ records, stats }) {
  const lastRecord = records[0];
  const demoVoltage = lastRecord ? lastRecord.voltage : BATTERY.voltage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Inspection Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>3.7V Li-ion Battery Quality Control</p>
        </div>
        <Link to="/inspect" style={{ textDecoration: 'none' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none',
            borderRadius: 12, padding: '10px 20px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Icon d={ICONS.plus} size={16} color="white" />
            New Inspection
          </button>
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="Total Inspections" value={stats.total} unit="tests" status="idle" icon="battery" />
        <StatCard label="Passed" value={stats.pass} unit="units" status="pass" icon="check" />
        <StatCard label="Failed" value={stats.fail} unit="units" status="fail" icon="alert" />
        <StatCard label="Pass Rate" value={stats.passRate ?? '—'} unit={stats.passRate != null ? '%' : ''}
          status={stats.passRate == null ? 'idle' : stats.passRate >= 90 ? 'pass' : 'warn'} icon="info" />
      </div>

      {/* Middle row: battery visual + mean bar chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <SectionLabel>BATTERY MODEL</SectionLabel>
          <BatteryVisual voltage={demoVoltage} hasCrack={lastRecord?.hasCrack || false} />
          <div style={{ width: '100%', borderTop: '1px solid #1e293b', paddingTop: 16,
            display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Nominal Voltage', `${BATTERY.voltage} V`], ['Type', BATTERY.type], ['Capacity', `${BATTERY.capacity} Ah`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{k}</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel>AVERAGE VALUES ACROSS ALL RECORDS</SectionLabel>
          <MeanBarChart records={records} />
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, marginTop: 16 }}>
            <SectionLabel>INSPECTION CRITERIA</SectionLabel>
            <CriteriaList />
          </div>
        </Card>
      </div>

      {/* Recent table */}
      <Card>
        <SectionLabel>RECENT INSPECTIONS</SectionLabel>
        <RecentTable records={records} />
      </Card>
    </div>
  );
}