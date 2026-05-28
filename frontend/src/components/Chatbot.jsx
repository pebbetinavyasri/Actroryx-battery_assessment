import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './UI';
import { ICONS } from '../utils/constants';
import { useChat } from '../hooks/useChat';

const SUGGESTIONS = [
  'What causes battery voltage drop?',
  'Explain internal impedance',
  'How to detect Li-ion leaks?',
  'Safe temperature ranges for Li-ion',
  'What happens when impedance is high?',
];

export function Chatbot() {
  const { messages, loading, send } = useChat();
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => { send(input); setInput(''); };

  return (
    <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', borderRadius: 20,
      border: '1px solid #334155', display: 'flex', flexDirection: 'column', height: 540, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #1e293b',
        background: 'linear-gradient(90deg,#6366f122,#8b5cf622)',
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={ICONS.chat} size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>AI Battery Inspector</div>
          <div style={{ fontSize: 11, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            Powered by Claude AI
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
                <Icon d={ICONS.zap} size={13} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: '76%', padding: '12px 16px', lineHeight: 1.65, fontSize: 13.5,
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#1e293b',
              color: 'white', border: m.role === 'assistant' ? '1px solid #334155' : 'none',
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '12px 16px', background: '#1e293b',
            borderRadius: '18px 18px 18px 4px', width: 'fit-content', border: '1px solid #334155' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1',
                animation: `pulse 1.4s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions (only before first user message) */}
      {messages.length === 1 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { send(s); }}
              style={{ fontSize: 11.5, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                border: '1px solid #334155', background: '#0f172a', color: '#94a3b8' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', display: 'flex', gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about battery inspection, safety, or specs…"
          style={{ flex: 1, background: '#0f172a', border: '1px solid #334155',
            borderRadius: 12, padding: '10px 16px', color: 'white', fontSize: 13.5, outline: 'none' }} />
        <button onClick={handleSend} disabled={loading || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: input.trim() ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#1e293b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}>
          <Icon d={ICONS.send} size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
