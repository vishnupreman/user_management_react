import axios from 'axios';
import { refreshAccessToken } from './auth'; 
import type { RootState, AppDispatch } from '../store/Store'; 


const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, 
});


let isRefreshing = false;


export const setupInterceptors = (getState: () => RootState, dispatch: AppDispatch) => {
 
  API.interceptors.request.use(
    (config) => {
      const { auth } = getState();
      if (auth.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

   
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
         
          return Promise.reject(error);
        }

      
        originalRequest._retry = true;
        isRefreshing = true;

        try {
        
          const { accessToken } = await refreshAccessToken();
          localStorage.setItem('accessToken', accessToken);

          
          dispatch({ type: 'auth/setAccessToken', payload: accessToken });

  
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        
          return API(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);

       
          dispatch({ type: 'auth/logout' });
          window.location.href = '/admin/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default API;
