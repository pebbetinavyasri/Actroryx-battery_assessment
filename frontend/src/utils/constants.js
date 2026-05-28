// Battery model specifications
export const BATTERY = {
  voltage: 3.7,
  type: 'Li-ion',
  capacity: 2.6,
};

// Inspection thresholds
export const LIMITS = {
  voltageMin: 3.0,
  tempMax: 60,
  impedanceMax: 0.07,
};

// Status definitions
export const STATUS = {
  pass: { label: 'PASS', color: '#22c55e', bg: '#dcfce7', border: '#86efac' },
  fail: { label: 'FAIL', color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' },
  warn: { label: 'WARN', color: '#f59e0b', bg: '#fef3c7', border: '#fcd34d' },
  idle: { label: 'PENDING', color: '#6366f1', bg: '#eef2ff', border: '#a5b4fc' },
};

// API base URL
export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// SVG icon paths
export const ICONS = {
  battery: 'M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4zm16 2h1a1 1 0 0 1 0 2h-1M7 12h3',
  voltage: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  temp: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z',
  impedance: 'M22 12h-4l-3 9L9 3l-3 9H2',
  crack: 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z',
  send: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8',
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m6 0h-6',
  history: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  close: 'M6 18L18 6M6 6l12 12',
  plus: 'M12 4v16m8-8H4',
  check: 'M5 13l4 4L19 7',
  alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  download: 'M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  zap: 'M13 10V3L4 14h7v7l9-11h-7z',
  trash: 'M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16',
};
