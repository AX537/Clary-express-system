import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 (expired token) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  login:      (credentials) => api.post('/auth/login', credentials),
  register:   (userData)    => api.post('/auth/register', userData),
  getProfile: ()            => api.get('/auth/me'),
};

// ─── Users (Admin only) ───────────────────────────────────
export const userAPI = {
  getUsers:   ()               => api.get('/admin/users'),
  getUser:    (id)             => api.get(`/admin/users/${id}`),
  updateUser: (id, userData)   => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id)             => api.delete(`/admin/users/${id}`),
};

// ─── Buses ───────────────────────────────────────────────
export const busAPI = {
  // Passenger
  searchBuses: (origin, destination, date) => {
    const params = new URLSearchParams();
    if (origin)      params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date)        params.append('date', date);
    return api.get(`/buses/search?${params}`);
  },
  getBusSeats: (busId) => api.get(`/buses/${busId}/seats`),

  // Admin
  getAllBuses: (params) => api.get('/admin/buses', { params }),
  createBus:  (busData) => api.post('/admin/buses', busData),
  updateBus:  (id, busData) => api.put(`/admin/buses/${id}`, busData),
  deleteBus:  (id) => api.delete(`/admin/buses/${id}`),
};

// ─── Routes ──────────────────────────────────────────────
export const routeAPI = {
  getRoutes:   ()              => api.get('/routes'),
  createRoute: (routeData)     => api.post('/admin/routes', routeData),
  deleteRoute: (id)            => api.delete(`/admin/routes/${id}`),
};

// ─── Bookings ────────────────────────────────────────────
export const bookingAPI = {
  getBookings:    ()              => api.get('/bookings'),
  getBooking:     (id)            => api.get(`/bookings/${id}`),
  createBooking:  (bookingData)   => api.post('/bookings', bookingData),
  cancelBooking:  (id)            => api.delete(`/bookings/${id}`),
};

// ─── Payments ────────────────────────────────────────────
// Backend: POST /payments/initiate  { bookingId, phoneNumber, amount }
//          POST /payments/verify    { token }   ← used by driver at gate
//          GET  /payments/:id/status
//          GET  /payments/:id
export const paymentAPI = {
  initiatePayment:   (bookingId, phoneNumber, amount) =>
    api.post('/payments/initiate', { bookingId, phoneNumber, amount }),

  checkPaymentStatus: (id) => api.get(`/payments/${id}/status`),

  getPayment:        (id)     => api.get(`/payments/${id}`),

  // Driver/Supervisor: verify QR token at boarding gate
  verifyQRToken:     (token)  => api.post('/payments/verify', { token }),
};

// ─── Companies (Admin only) ───────────────────────────────
export const companyAPI = {
  getCompanies:   ()                  => api.get('/admin/companies'),
  createCompany:  (companyData)       => api.post('/admin/companies', companyData),
  updateCompany:  (id, companyData)   => api.put(`/admin/companies/${id}`, companyData),
  deleteCompany:  (id)                => api.delete(`/admin/companies/${id}`),
};

// ─── Notifications ───────────────────────────────────────
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead:       (id) => api.patch(`/notifications/${id}/read`),
};

// ─── Travel History (Driver / Supervisor) ────────────────
export const travelHistoryAPI = {
  getHistory:     ()   => api.get('/travel-history'),
  getHistoryById: (id) => api.get(`/travel-history/${id}`),
};

export default api;