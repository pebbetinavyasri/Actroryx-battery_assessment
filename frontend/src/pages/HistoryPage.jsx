import React from 'react';
import { Card, Icon, StatusBadge, LoadingSpinner } from '../components/UI';
import { ICONS, STATUS } from '../utils/constants';
import { format } from 'date-fns';

function HistoryTable({ records, onDelete }) {
  if (!records.length) return (
    <div style={{ textAlign: 'center', padding: 48, color: '#475569' }}>
      <Icon d={ICONS.history} size={36} color="#334155" />
      <div style={{ marginTop: 10, fontSize: 14 }}>No inspection records yet</div>
      <div style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>Run your first inspection to see data here</div>
    </div>
  );

  const cols = ['#', 'Date', 'Time', 'Voltage', 'Temp', 'Impedance', 'Physical', 'Result', ''];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e293b' }}>
            {cols.map(h => (
              <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => {
            const s = STATUS[r.overall];
            const ts = r.createdAt ? new Date(r.createdAt) : null;
            return (
              <tr key={r._id || i} style={{ borderBottom: '1px solid #0f172a', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e293b44'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '10px 14px', color: '#475569' }}>{records.length - i}</td>
                <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{ts ? format(ts, 'dd MMM yyyy') : '–'}</td>
                <td style={{ padding: '10px 14px', color: '#64748b' }}>{ts ? format(ts, 'HH:mm:ss') : '–'}</td>
                <td style={{ padding: '10px 14px', color: r.checks?.voltage === 'pass' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{r.voltage} V</td>
                <td style={{ padding: '10px 14px', color: r.checks?.temperature === 'pass' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{r.temperature} °C</td>
                <td style={{ padding: '10px 14px', color: r.checks?.impedance === 'pass' ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{r.impedance} Ω</td>
                <td style={{ padding: '10px 14px', color: r.checks?.crack === 'pass' ? '#22c55e' : '#ef4444' }}>
                  {r.hasCrack ? '⚠ Damage' : '✓ Clear'}
                </td>
                <td style={{ padding: '10px 14px' }}><StatusBadge status={r.overall} /></td>
                <td style={{ padding: '10px 14px' }}>
                  <button onClick={() => onDelete(r._id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569',
                      padding: 4, borderRadius: 6, transition: 'color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                    <Icon d={ICONS.trash} size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function HistoryPage({ records, onDelete, loading }) {
  const passCount = records.filter(r => r.overall === 'pass').length;
  const failCount = records.filter(r => r.overall === 'fail').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Inspection History</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            {records.length} total records • {passCount} passed • {failCount} failed
          </p>
        </div>
        {loading && <LoadingSpinner />}
      </div>

      {/* Summary bar */}
      {records.length > 0 && (
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'All', count: records.length, color: '#6366f1' },
            { label: 'Pass', count: passCount, color: '#22c55e' },
            { label: 'Fail', count: failCount, color: '#ef4444' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
              background: '#1e293b', borderRadius: 10, border: '1px solid #334155' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}:</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      <Card>
        <HistoryTable records={records} onDelete={onDelete} />
      </Card>
    </div>
  );
}
