import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL_ANDROID, API_URL_IOS, PHYSICAL_DEVICE_URL } from '@env';
import { isDevice } from 'expo-device';

let baseURL;
if (Platform.OS === 'android') {
  baseURL = isDevice ? PHYSICAL_DEVICE_URL : API_URL_ANDROID;
} else {
  baseURL = isDevice ? PHYSICAL_DEVICE_URL : API_URL_IOS;
}

console.log('Platform:', Platform.OS);
console.log('Is physical device:', isDevice);
console.log('Using API URL:', baseURL);

// Create Axios instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token interceptor
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const APIService = {
  // Authentication
  login: (loginData: { login: string; password: string }) => 
    api.post('/login', loginData),
  
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
  
  // Categories
  getCategories: () => api.get('/categories'),
  getProductsByCategory: (categoryId: number) => api.get(`/categories/${categoryId}/products`),
  
  // Search
  searchProducts: (searchTerm: string) => api.get(`/products/search?q=${encodeURIComponent(searchTerm)}`),
  
  // Cart
  getCart: () => api.get('/cart'),
  addToCart: (productId: number, quantity: number = 1) => 
    api.post('/cart/add', { product_id: productId, quantity }),
  
  // Cart management methods
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId: number) => 
    api.delete(`/cart/items/${itemId}`),
  clearCart: () => 
    api.delete('/cart')
};

export default APIService;