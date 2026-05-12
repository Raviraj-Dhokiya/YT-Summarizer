import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const summarizeVideoApi = (url) => api.post('/summarize', { url });
export const getHistoryApi = () => api.get('/history');
export const deleteVideoApi = (videoId) => api.delete(`/history/${videoId}`);
