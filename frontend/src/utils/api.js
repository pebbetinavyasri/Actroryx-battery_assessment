import axios from 'axios';
import { API_BASE } from './constants';

const api = axios.create({ baseURL: API_BASE });

// Inspections
export const fetchInspections = () => api.get('/api/inspections');
export const createInspection = (data) => api.post('/api/inspections', data);
export const deleteInspection = (id) => api.delete(`/api/inspections/${id}`);

// Chat (Claude API via backend)
export const sendChatMessage = (messages) =>
  api.post('/api/chat', { messages });

export default api;
