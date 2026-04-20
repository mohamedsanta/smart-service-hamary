import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: `${BASE}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss-admin-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getInventory = () => api.get('/inventory').then((r) => r.data);
export const createBooking = (data: any) => api.post('/bookings', data).then((r) => r.data);
export const getBookingByRef = (ref: string) => api.get(`/bookings/ref/${ref}`).then((r) => r.data);
export const joinWaitlist = (data: any) => api.post('/waitlist', data).then((r) => r.data);
export const adminLogin = (u: string, p: string) => api.post('/auth/login', { username: u, password: p }).then((r) => r.data);
export const getAdminBookings = (params?: any) => api.get('/admin/bookings', { params }).then((r) => r.data);
export const getAdminBooking = (id: string) => api.get(`/admin/bookings/${id}`).then((r) => r.data);
export const updateBookingStatus = (id: string, data: any) => api.patch(`/admin/bookings/${id}/status`, data).then((r) => r.data);
export const resendInvoice = (id: string) => api.post(`/admin/bookings/${id}/resend-invoice`).then((r) => r.data);
export const getAdminStats = () => api.get('/admin/stats').then((r) => r.data);
export const adjustInventory = (reserved: number) => api.patch('/inventory', { reserved }).then((r) => r.data);
export const getInvoiceUrl = (reference: string) => `${BASE}/api/invoices/${reference}`;
export const getInvoiceDownloadUrl = (reference: string) => `${BASE}/api/invoices/${reference}/download`;
