import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL_ANDROID, API_URL_IOS, DEV_MACHINE_IP } from '@env';

// Configure URL based on platform and environment
const isAndroid = Platform.OS === 'android';
const isSimulator = Platform.OS === 'ios' && 
  !!/iPhone Simulator|iPad Simulator/.test(navigator.userAgent);

let baseURL = '';
if (isAndroid) {
  baseURL = API_URL_ANDROID;
} else if (isSimulator) {
  baseURL = API_URL_IOS;
} else {
  baseURL = `http://${DEV_MACHINE_IP}:8000/api`;
}

const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Auth token interceptor
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing token:', error);
  }
  return config;
});

const APIService = {
  // Authentication
  login: (credentials: { email?: string; phone_number?: string; password: string }) => 
    api.post('/login', credentials),
  
  register: async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    phone_number: string; 
    password_confirmation: string 
  }) => {
    try {
      const response = await api.post('/register', userData);
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  },
  
  logout: () => api.post('/logout'),
  
  // User profile
  getUser: () => api.get('/user'),
  updateProfile: (profileData: { name: string; email: string }) => 
    api.put('/profile', profileData),
  updatePassword: (passwordData: { 
    current_password: string; 
    new_password: string; 
    new_password_confirmation: string 
  }) => api.put('/user/password', passwordData),
  
  // Products
  getProducts: () => api.get('/products'),
  getProduct: (id: number | string) => api.get(`/products/${id}`),
  
  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (productId: number, quantity: number = 1) => 
    api.post('/cart/add', { product_id: productId, quantity })
};

export default APIService;