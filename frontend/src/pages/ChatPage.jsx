import React from 'react';
import { Chatbot } from '../components/Chatbot';

export default function ChatPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 740, margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>AI Battery Expert</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          Ask anything about Li-ion battery inspection, safety standards, and performance
        </p>
      </div>
      <Chatbot />
      <div style={{ background: '#1e293b44', border: '1px solid #1e293b', borderRadius: 12, padding: '14px 18px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
        <strong style={{ color: '#64748b' }}>Note:</strong> This AI assistant is pre-loaded with context about your battery model (3.7V Li-ion, 2.6 Ah) and all inspection thresholds. Responses are powered by Claude via your backend API.
      </div>
    </div>
  );
}
