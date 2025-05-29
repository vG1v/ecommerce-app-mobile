import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../types/navigation';

interface Product {
  id: number;
  name: string;
  price: number | string;
  image: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  theme?: 'default' | 'yellow';
  onPress?: () => void;
  onAddToCart?: () => void; // Add this line
}

const ProductCard: React.FC<ProductCardProps> = ({ product, theme = 'default', onPress, onAddToCart }) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      // If the parent provided an onAddToCart function, use it
      onAddToCart();
      return;
    }
    
    if (!isAuthenticated) {
      navigation.navigate('Login', { 
        returnTo: route.name as keyof RootStackParamList || 'Dashboard'
      });
      return;
    }
    
    // Default add to cart logic if no onAddToCart provided
    // APIService.addToCart(product.id, 1)...
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        theme === 'yellow' ? styles.cardYellow : styles.cardDefault
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        {theme === 'yellow' && product.category && (
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {product.category || 'General'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text 
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[
            styles.price, 
            theme === 'yellow' ? styles.priceYellow : styles.priceDefault
          ]}>
            ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
          </Text>
          
          {theme === 'yellow' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToCart}  // Update this to use our new handler
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {theme === 'yellow' && (
          <Text style={styles.salesText}>
            Sales: 2.5k+ | ⭐⭐⭐⭐½
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardYellow: {
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  categoryTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#fef3c7', // amber-100
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#92400e', // amber-800
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    height: 40, // Approximate 2 lines height
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontWeight: '600',
  },
  priceDefault: {
    color: '#1f2937', // gray-900
  },
  priceYellow: {
    color: '#b45309', // amber-700
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#f59e0b', // amber-500
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  salesText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280', // gray-500
  }
});

export default ProductCard;