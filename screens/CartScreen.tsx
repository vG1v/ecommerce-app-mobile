import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/layout/NavBar';
import APIService from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
  subtotal: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  tax_rate?: number;
  total: number;
}

const CartScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation() as any;
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch cart on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login', { returnTo: 'Cart' });
      return;
    }

    fetchCart();
  }, [isAuthenticated, navigation]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await APIService.getCart();

      let cartData: Cart;

      if (response.data) {
        const safeItems: CartItem[] = response.data.items?.map((item: any) => {
          const product = item.product || {};
          
          // Prepare image URL - use placeholder if not available
          const imageUrl = product.main_image_path 
            ? `http://192.168.0.211:8000/storage/${product.main_image_path}`
            : `https://placehold.co/300x300/fbbf24/000000?text=${encodeURIComponent(product.name || 'Product')}`;

          return {
            id: item.id,
            product_id: item.product_id,
            product_name: product.name || 'Unknown Product',
            quantity: item.quantity || 1,
            price: product.price ? parseFloat(product.price) : 0,
            image_url: imageUrl,
            subtotal: (item.quantity || 1) * (product.price ? parseFloat(product.price) : 0)
          };
        }) || [];

        const subtotal = safeItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax_rate = 0.1;
        const tax = subtotal * tax_rate;
        const total = response.data.total ? parseFloat(response.data.total) : (subtotal + tax);

        cartData = {
          items: safeItems,
          subtotal,
          tax,
          tax_rate,
          total
        };
      } else {
        cartData = { items: [], subtotal: 0, tax: 0, tax_rate: 0.1, total: 0 };
      }

      setCart(cartData);
      setError('');
    } catch (err) {
      setError('Failed to load your cart');
      setCart({ items: [], subtotal: 0, tax: 0, tax_rate: 0.1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await APIService.updateCartItem(itemId, newQuantity);

      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
            : item
        );

        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const newTax = newSubtotal * 0.1;
        const newTotal = newSubtotal + newTax;

        return {
          items: updatedItems,
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal
        };
      });
    } catch (err) {
      setError('Failed to update item quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setUpdating(true);
      await APIService.removeCartItem(itemId);

      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const newTax = newSubtotal * 0.1;
        const newTotal = newSubtotal + newTax;

        return {
          items: updatedItems,
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal
        };
      });
    } catch (err) {
      setError('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes", 
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);
              await APIService.clearCart();
              setCart({ items: [], subtotal: 0, tax: 0, total: 0 });
            } catch (err) {
              setError('Failed to clear cart');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout', { cart });
  };

  const renderCartItem = (item: CartItem) => {
    return (
      <View key={item.id} style={styles.cartItem}>
        <View style={styles.cartItemContent}>
          <View style={styles.productInfoContainer}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>{item.product_name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              disabled={updating}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>${item.subtotal.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
            disabled={updating}
          >
            <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <Ionicons name="cart-outline" size={80} color="#f59e0b" />
        <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
        <Text style={styles.emptyCartText}>
          Looks like you haven't added any products to your cart yet.
        </Text>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Homepage')}
        >
          <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <NavBar cartItemsCount={0} theme="yellow" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar cartItemsCount={cart.items.length} theme="yellow" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
          {cart.items.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {cart.items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <View style={styles.cartContainer}>
            <View style={styles.cartItems}>
              {cart.items.map(renderCartItem)}
            </View>
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cart.subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax ({((cart.tax_rate || 0.1) * 100).toFixed(0)}%)</Text>
                <Text style={styles.summaryValue}>${cart.tax.toFixed(2)}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                disabled={updating}
              >
                <LinearGradient
                  colors={["#f59e0b", "#d97706"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutButtonGradient}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 16,
    margin: 16,
    borderRadius: 4,
  },
  errorText: {
    color: '#dc2626',
  },
  emptyCartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#111827',
  },
  emptyCartText: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  continueShoppingButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  continueShoppingButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cartContainer: {
    paddingBottom: 24,
  },
  cartItems: {
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    overflow: 'hidden',
  },
  cartItemContent: {
    padding: 16,
  },
  productInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    minWidth: 24,
    textAlign: 'center',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subtotalLabel: {
    color: '#6b7280',
  },
  subtotalValue: {
    fontWeight: '600',
    color: '#f59e0b',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  summaryContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    color: '#1f2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f59e0b',
  },
  checkoutButton: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  checkoutButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;