import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const summarizeVideoApi = (url, language = 'English') => api.post('/summarize', { url, language });
export const getHistoryApi = () => api.get('/history');
export const deleteVideoApi = (videoId) => api.delete(`/history/${videoId}`);
export const chatWithVideoApi = (videoId, question, chatHistory = []) =>
  api.post('/chat', { videoId, question, chatHistory });
