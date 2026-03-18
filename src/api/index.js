import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL:         API_BASE,
  withCredentials: true,
});

// ── Auth ──────────────────────────────────────────────────
export const login  = (username, password) =>
  api.post('/auth/login', { username, password });

export const logout = () =>
  api.post('/auth/logout');

// ── Tables ────────────────────────────────────────────────
export const getTables  = ()     => api.get('/tables');
export const getColumns = (name) => api.get(`/tables/${name}/columns`);

// ── Import flow ───────────────────────────────────────────
export const uploadFile = (tableName, file) => {
  const form = new FormData();
  form.append('tableName', tableName);
  form.append('excelFile',  file);
  return api.post('/upload', form);
};

export const commitImport   = () => api.post('/commit');
export const rollbackImport = () => api.post('/rollback');

// ── Utility ───────────────────────────────────────────────
export const clearUploads = () => api.post('/clear-uploads');

export default api;

