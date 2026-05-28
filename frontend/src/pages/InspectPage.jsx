import React, { useState } from 'react';
import { InspectionForm } from '../components/InspectionForm';
import { ResultCard } from '../components/ResultCard';

export default function InspectPage({ onSubmit, submitLoading }) {
  const [result, setResult] = useState(null);

  const handleSubmit = async (vals) => {
    const r = await onSubmit(vals);
    setResult(r);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 700, margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Run Battery Inspection</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Enter measured values to verify against all safety thresholds
        </p>
      </div>
      <InspectionForm onSubmit={handleSubmit} loading={submitLoading} />
      {result && <ResultCard result={result} onClose={() => setResult(null)} />}
    </div>
  );
}
