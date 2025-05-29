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

// Handle response unwrapping (matching React.js version)
api.interceptors.response.use(
  response => {
    // If response has a status and data structure, return just the data
    if (response.data && response.data.status === 'success' && response.data.data) {
      response.data = response.data.data;
    }
    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const APIService = {
  // Auth endpoints
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
  
  getUser: () => api.get('/user'),

  updateProfile: (profileData: { name: string; email: string }) => 
    api.put('/profile', profileData),

  updatePassword: (passwordData: { 
    current_password: string; 
    new_password: string; 
    new_password_confirmation: string 
  }) => api.put('/user/password', passwordData),
  
  // Product endpoints
  getProducts: (page = 1, perPage = 12) =>
    api.get('/products', { params: { page, per_page: perPage }}),

  getProduct: (id: number | string) =>
    api.get(`/products/${id}`),
    
  searchProducts: (params: {
    q?: string;
    min_price?: number;
    max_price?: number;
    vendor_id?: number;
    featured?: boolean;
    in_stock?: boolean;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    per_page?: number;
  } = {}) => 
    api.get('/products/search', { params }),

  getFeaturedProducts: () =>
    api.get('/products/featured'),
    
  getRelatedProducts: (productId: number | string) =>
    api.get(`/products/${productId}/related`),
  
  // Categories
  getCategories: () => api.get('/categories'),
  getProductsByCategory: (categoryId: number) => api.get(`/categories/${categoryId}/products`),
  
  // Cart endpoints
  getCart: () => api.get('/cart'),
  
  addToCart: (productId: number, quantity: number = 1) => 
    api.post('/cart/add', { product_id: productId, quantity }),
  
  updateCartItem: (itemId: number, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
    
  removeCartItem: (itemId: number) => 
    api.delete(`/cart/items/${itemId}`),
  
  clearCart: () => 
    api.delete('/cart/clear'),
    
  getCartCount: () =>
    api.get('/cart/count'),

  // Wishlist endpoints
  getWishlist: () =>
    api.get('/wishlist'),
    
  addToWishlist: (productId: number) =>
    api.post('/wishlist/add', { product_id: productId }),
    
  removeFromWishlist: (itemId: number) =>
    api.delete(`/wishlist/items/${itemId}`),
    
  clearWishlist: () =>
    api.delete('/wishlist/clear'),
    
  checkWishlistItem: (productId: number) =>
    api.get(`/wishlist/check/${productId}`),
    
  getWishlistCount: () =>
    api.get('/wishlist/count'),

  // Order endpoints
  getOrders: (page = 1, perPage = 10) => 
    api.get('/orders', { params: { page, per_page: perPage }}),

  createOrder: (orderData: {
    shipping_name?: string;
    shipping_address_line1?: string;
    shipping_address_line2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_postal_code?: string;
    shipping_country?: string;
    shipping_phone?: string;
    payment_method?: string;
    notes?: string;
    shipping_address_id?: number;
  }) => 
    api.post('/orders', orderData),

  getOrder: (id: number) =>
    api.get(`/orders/${id}`),

  cancelOrder: (id: number, reason?: string) =>
    api.post(`/orders/${id}/cancel`, { reason }),

  getRecentOrders: (limit = 5) =>
    api.get('/orders/recent', { params: { limit }}),

  getOrderStats: () =>
    api.get('/orders/stats'),
};

export default APIService;