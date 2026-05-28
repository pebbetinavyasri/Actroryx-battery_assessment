import React, { useState } from 'react';
import { Icon } from './UI';
import { ICONS, LIMITS } from '../utils/constants';

export function InspectionForm({ onSubmit, loading }) {
  const [vals, setVals] = useState({ voltage: '', temperature: '', impedance: '', hasCrack: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!vals.voltage || isNaN(vals.voltage) || vals.voltage === '')
      e.voltage = `Enter a valid voltage (e.g. 3.5). Min threshold: ${LIMITS.voltageMin}V`;
    if (!vals.temperature || isNaN(vals.temperature))
      e.temperature = `Enter a valid temperature. Max: ${LIMITS.tempMax}°C`;
    if (!vals.impedance || isNaN(vals.impedance))
      e.impedance = `Enter a valid impedance. Max: ${LIMITS.impedanceMax}Ω`;
    if (vals.hasCrack === '') e.hasCrack = 'Select Yes or No';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      await onSubmit(vals);
      setVals({ voltage: '', temperature: '', impedance: '', hasCrack: '' });
      setErrors({});
    } catch (err) {
      setErrors({ submit: 'Failed to save inspection. Is the backend running?' });
    }
  };

  const field = (key, label, placeholder, hint) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1,
        color: '#94a3b8', marginBottom: 6 }}>{label}</label>
      <input
        type="number"
        step="any"
        value={vals[key]}
        onChange={e => { setVals({ ...vals, [key]: e.target.value }); setErrors({ ...errors, [key]: null }); }}
        placeholder={placeholder}
        style={{ width: '100%', background: '#0f172a',
          border: `1px solid ${errors[key] ? '#ef4444' : '#334155'}`,
          borderRadius: 10, padding: '11px 14px', color: 'white', fontSize: 14,
          outline: 'none', transition: 'border .2s' }}
        onFocus={e => { if (!errors[key]) e.target.style.borderColor = '#6366f1'; }}
        onBlur={e => { if (!errors[key]) e.target.style.borderColor = '#334155'; }}
      />
      {hint && !errors[key] && <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{hint}</div>}
      {errors[key] && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)',
      borderRadius: 20, padding: 28, border: '1px solid #334155' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ICONS.zap} size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>New Battery Inspection</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>3.7V Li-ion • 2.6 Ah</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        {field('voltage', 'VOLTAGE (V)', 'e.g. 3.5', `Must be > ${LIMITS.voltageMin} V`)}
        {field('temperature', 'TEMPERATURE (°C)', 'e.g. 45', `Must be < ${LIMITS.tempMax} °C`)}
        {field('impedance', 'IMPEDANCE (Ω)', 'e.g. 0.05', `Must be < ${LIMITS.impedanceMax} Ω`)}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1,
            color: '#94a3b8', marginBottom: 6 }}>CRACKS / LEAKS PRESENT</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Yes', 'No'].map(opt => (
              <button key={opt} onClick={() => { setVals({ ...vals, hasCrack: opt }); setErrors({ ...errors, hasCrack: null }); }}
                style={{ flex: 1, padding: '11px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${vals.hasCrack === opt ? '#6366f1' : errors.hasCrack ? '#ef4444' : '#334155'}`,
                  background: vals.hasCrack === opt ? '#6366f111' : '#0f172a',
                  color: vals.hasCrack === opt ? '#818cf8' : '#94a3b8',
                  fontSize: 14, fontWeight: 600, transition: 'all .2s' }}>
                {opt}
              </button>
            ))}
          </div>
          {errors.hasCrack && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.hasCrack}</div>}
        </div>
      </div>

      {errors.submit && (
        <div style={{ background: '#450a0a', border: '1px solid #ef444433', borderRadius: 10,
          padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 14 }}>
          {errors.submit}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        style={{ width: '100%', background: loading ? '#334155' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: 'none', borderRadius: 12, padding: '14px', color: 'white', fontSize: 15,
          fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'opacity .2s' }}>
        <Icon d={ICONS.check} size={18} color="white" />
        {loading ? 'Running Inspection…' : 'Run Inspection'}
      </button>
    </div>
  );
}
