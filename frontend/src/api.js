import axios from 'axios';
import { auth } from './firebaseConfig';

const apiClient = axios.create({
    baseURL: '/api', 
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        try{
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        }catch (error) {
            console.log('Eroare la obtinerea toeknului:',error);
            window.location.href='/login';
        } 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const user = auth.currentUser;
      if (user) {
        try {
          const newToken = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          await auth.signOut();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;