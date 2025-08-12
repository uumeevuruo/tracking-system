import axios from 'axios';
import router from '../routes';


const BASE_URL = "http://localhost:8081/api/v1"
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        "X_TENANCY": "public"
    },baseURL: BASE_URL,
})


// axiosInstance.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Save current path for redirect after login
//       localStorage.setItem('redirectPath', window.location.pathname);
//       removeUser()
//       router.push("/login");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;