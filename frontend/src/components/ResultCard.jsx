import React from 'react';
import { Icon, StatusBadge } from './UI';
import { ICONS, STATUS, LIMITS } from '../utils/constants';
import { format } from 'date-fns';

// Human-readable failure reasons for each check
function getFailReason(key, result) {
  switch (key) {
    case 'voltage':
      return result.checks?.voltage === 'fail'
        ? `Measured ${result.voltage} V — minimum required is ${LIMITS.voltageMin} V. Battery is critically discharged and may not deliver stable power. Recharge or replace.`
        : null;
    case 'temperature':
      return result.checks?.temperature === 'fail'
        ? `Measured ${result.temperature} °C — maximum allowed is ${LIMITS.tempMax} °C. Overheating risk detected. Allow battery to cool before use; check environment or load.`
        : null;
    case 'impedance':
      return result.checks?.impedance === 'fail'
        ? `Measured ${result.impedance} Ω — maximum allowed is ${LIMITS.impedanceMax} Ω. High internal resistance indicates cell degradation, sulfation, or aging. Battery may need replacement.`
        : null;
    case 'crack':
      return result.checks?.crack === 'fail'
        ? `Physical damage (cracks or leaks) detected. Electrolyte leakage poses a serious chemical and fire hazard. Do NOT use — isolate and dispose of safely.`
        : null;
    default:
      return null;
  }
}

export function ResultCard({ result, onClose }) {
  const overall = STATUS[result.overall];
  const checks = result.checks || {};

  const rows = [
    { key: 'voltage',     label: 'Voltage',     val: `${result.voltage} V`,                        limit: `> ${LIMITS.voltageMin} V`,     icon: 'voltage'   },
    { key: 'temperature', label: 'Temperature',  val: `${result.temperature} °C`,                   limit: `< ${LIMITS.tempMax} °C`,       icon: 'temp'      },
    { key: 'impedance',   label: 'Impedance',    val: `${result.impedance} Ω`,                      limit: `< ${LIMITS.impedanceMax} Ω`,   icon: 'impedance' },
    { key: 'crack',       label: 'Physical',     val: result.hasCrack ? 'Damage Found' : 'No Damage', limit: 'No cracks / leaks',          icon: 'crack'     },
  ];

  const failedCount = Object.values(checks).filter(v => v === 'fail').length;

  return (
    <div style={{
      background: `linear-gradient(135deg,${result.overall === 'pass' ? '#052e16' : '#450a0a'},#0f172a)`,
      border: `1px solid ${overall.border}44`, borderRadius: 20, padding: 28, position: 'relative',
      animation: 'fadeIn .4s ease',
    }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16,
        background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
        <Icon d={ICONS.close} size={18} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${overall.color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={result.overall === 'pass' ? ICONS.check : ICONS.alert} size={26} color={overall.color} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: overall.color }}>
            {result.overall === 'pass' ? 'Battery Passed All Checks' : `Battery Failed — ${failedCount} Issue${failedCount > 1 ? 's' : ''} Found`}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {result.createdAt ? format(new Date(result.createdAt), 'dd MMM yyyy, HH:mm:ss') : 'Just now'}
          </div>
        </div>
      </div>

      {/* Check grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {rows.map(({ key, label, val, limit, icon }) => {
          const s = STATUS[checks[key]] || STATUS.idle;
          const reason = getFailReason(key, result);
          const failed = checks[key] === 'fail';
          return (
            <div key={key} style={{
              background: failed ? '#1a0505cc' : '#0f172a88',
              borderRadius: 12, padding: '14px 16px',
              border: `1px solid ${s.border}${failed ? '66' : '33'}`,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon d={ICONS[icon]} size={18} color={s.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{val}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{limit}</div>
                </div>
                <StatusBadge status={checks[key]} />
              </div>

              {/* Failure reason banner */}
              {failed && reason && (
                <div style={{
                  marginTop: 10, padding: '9px 12px',
                  background: '#ef444411', border: '1px solid #ef444422',
                  borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <Icon d={ICONS.alert} size={14} color="#ef4444" strokeWidth={2} />
                  <span style={{ fontSize: 11.5, color: '#fca5a5', lineHeight: 1.5 }}>{reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}