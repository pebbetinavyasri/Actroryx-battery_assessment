import { useState, useEffect, useCallback } from 'react';
import { fetchInspections, createInspection, deleteInspection } from '../utils/api';
import { LIMITS } from '../utils/constants';

export function useInspections() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchInspections();
      setRecords(res.data);
    } catch (e) {
      setError('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submitInspection = useCallback(async (formValues) => {
    const v = parseFloat(formValues.voltage);
    const t = parseFloat(formValues.temperature);
    const imp = parseFloat(formValues.impedance);
    const hasCrack = formValues.hasCrack === 'Yes';

    const checks = {
      voltage: v > LIMITS.voltageMin ? 'pass' : 'fail',
      temperature: t < LIMITS.tempMax ? 'pass' : 'fail',
      impedance: imp < LIMITS.impedanceMax ? 'pass' : 'fail',
      crack: !hasCrack ? 'pass' : 'fail',
    };
    const overall = Object.values(checks).every((c) => c === 'pass') ? 'pass' : 'fail';

    const payload = { voltage: v, temperature: t, impedance: imp, hasCrack, checks, overall };
    const res = await createInspection(payload);
    setRecords((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const removeInspection = useCallback(async (id) => {
    await deleteInspection(id);
    setRecords((prev) => prev.filter((r) => r._id !== id));
  }, []);

  const stats = {
    total: records.length,
    pass: records.filter((r) => r.overall === 'pass').length,
    fail: records.filter((r) => r.overall === 'fail').length,
    passRate: records.length
      ? Math.round((records.filter((r) => r.overall === 'pass').length / records.length) * 100)
      : null,
  };

  return { records, loading, error, stats, submitInspection, removeInspection, reload: load };
}
