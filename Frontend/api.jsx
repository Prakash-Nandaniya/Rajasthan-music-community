import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BE_URL, // Replace with your backend URL
  withCredentials: true, 
  // Include credentials with requests
});

// Add token to headers if available
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

export default API;
