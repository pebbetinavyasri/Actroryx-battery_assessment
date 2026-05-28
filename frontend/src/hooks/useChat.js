import { useState, useCallback } from 'react';
import { sendChatMessage } from '../utils/api';

const INITIAL = {
  role: 'assistant',
  content:
    "Hello! I'm your Battery Inspection AI Assistant. Ask me anything about Li-ion batteries, inspection criteria, safety standards, or battery performance.",
};

export function useChat() {
  const [messages, setMessages] = useState([INITIAL]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);
    try {
      const history = [...messages, userMsg];
      const res = await sendChatMessage(history);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (e) {
      setError('Connection error. Please try again.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not connect to the AI service. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const reset = () => setMessages([INITIAL]);

  return { messages, loading, error, send, reset };
}
