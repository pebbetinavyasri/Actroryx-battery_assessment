import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Dashboard from './pages/Dashboard';
import InspectPage from './pages/InspectPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';
import { useInspections } from './hooks/useInspections';

const GLOBAL_STYLES = `
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{transform:scale(0.8);opacity:0.5} 50%{transform:scale(1.2);opacity:1} }
  .page { animation: fadeIn .35s ease; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`;

export default function App() {
  const { records, stats, loading, submitInspection, removeInspection } = useInspections();
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async (vals) => {
    setSubmitLoading(true);
    try {
      const result = await submitInspection(vals);
      return result;
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ background: '#060d1b', minHeight: '100vh', color: 'white', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }} className="page">
          <Routes>
            <Route path="/" element={<Dashboard records={records} stats={stats} />} />
            <Route path="/inspect" element={<InspectPage onSubmit={handleSubmit} submitLoading={submitLoading} />} />
            <Route path="/history" element={<HistoryPage records={records} onDelete={removeInspection} loading={loading} />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
