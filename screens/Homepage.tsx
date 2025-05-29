import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, ActivityIndicator, SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import APIService from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "../components/card/ProductCard";
import NavBar from "../components/layout/NavBar";
import CustomAlert from '../components/layout/CustomAlert';

// Types
interface Product {
  id: number;
  name: string;
  price: string; 
  main_image_path: string;
  description: string;
  featured: number; 
  category?: string; 
}

interface Category {
  id: number;
  name: string;
}

const Homepage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation() as any;
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true); 
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAddToCartAlert, setShowAddToCartAlert] = useState(false);
  const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null);

  // Fetch products, featured products, and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await APIService.getProducts();
        
        // Extract the actual products array from the paginated response
        const actualProducts: Product[] = productsRes.data.data;
        
        setProducts(actualProducts);
        setFilteredProducts(actualProducts);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const featuredRes = await APIService.getFeaturedProducts();
        
        // The response is already in the correct format
        const featuredData: Product[] = featuredRes.data;
        
        setFeaturedProducts(featuredData);
        setFeaturedLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
        setFeaturedLoading(false);
      }
    };

    fetchData();
    fetchFeaturedProducts(); 
  }, []);

  // Fetch cart item count
  useEffect(() => {
    if (user) {
      APIService.getCart()
        .then((res) => setCartItemCount(res.data.items.length))
        .catch((err) => console.error("Failed to fetch cart", err));
    }
  }, [user]);

  // Filter products by search term and category
  useEffect(() => {
    let result = products;

    // Filter by category
    if (selectedCategory) {
      const categoryName = categories.find(
        (cat) => cat.id === selectedCategory
      )?.name;
      if (categoryName) {
        result = result.filter((product) => product.category === categoryName);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products, categories]);

  const handleSearch = () => {
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigation.navigate("Login", { returnTo: "Homepage" });
      return;
    }
    
    try {
      await APIService.addToCart(productId, 1);
      
      // Update cart count
      const cartResponse = await APIService.getCart();
      setCartItemCount(cartResponse.data.items.length);
      
      // Set the last added product ID for the alert
      setLastAddedProductId(productId);
      setShowAddToCartAlert(true);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  // Mock data (keep as fallback)
  const mockCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Kitchen" },
    { id: 4, name: "Beauty" },
    { id: 5, name: "Sports" },
    { id: 6, name: "Books" },
    { id: 7, name: "Toys" },
    { id: 8, name: "Health" },
  ];

  const mockProducts: Product[] = [
    { id: 1, name: "Wireless Earbuds", price: "29.99", main_image_path: "mock/earbuds.jpg", description: "High quality wireless earbuds", featured: 1 },
    { id: 2, name: "Smart Watch", price: "89.99", main_image_path: "mock/watch.jpg", description: "Smart watch with fitness tracking", featured: 1 },
    { id: 3, name: "Summer T-Shirt", price: "19.99", main_image_path: "mock/tshirt.jpg", description: "Comfortable summer t-shirt", featured: 0 },
    { id: 4, name: "Kitchen Blender", price: "49.99", main_image_path: "mock/blender.jpg", description: "Powerful kitchen blender", featured: 0 },
    { id: 5, name: "Bluetooth Speaker", price: "39.99", main_image_path: "mock/speaker.jpg", description: "Portable bluetooth speaker", featured: 1 },
    { id: 6, name: "Running Shoes", price: "59.99", main_image_path: "mock/shoes.jpg", description: "Lightweight running shoes", featured: 0 },
    { id: 7, name: "Coffee Maker", price: "69.99", main_image_path: "mock/coffee.jpg", description: "Automatic coffee maker", featured: 0 },
    { id: 8, name: "Yoga Mat", price: "24.99", main_image_path: "mock/yoga.jpg", description: "Non-slip yoga mat", featured: 0 },
  ];

  // Use real data with fallback to mock data
  const displayCategories = mockCategories; 


  const displayProducts = (() => {
    if (loading) {
      return mockProducts;
    }
    
    if (filteredProducts.length > 0) {
      return filteredProducts;
    }
    return mockProducts;
  })();

  const displayFeaturedProducts = (() => {
    if (featuredLoading) {
      return mockProducts.slice(0, 6);
    }
    
    if (featuredProducts.length > 0) {
      return featuredProducts;
    }
    
    return mockProducts.filter((product: Product) => product.featured === 1);
  })();

  // Update renderFlashDeal to always use placeholder images:
  const renderFlashDeal = ({ item }: { item: Product }) => {
    
    const shortenedName = item.name.length > 12 
      ? item.name.substring(0, 10) + ".."
      : item.name;

    const productForFlashDeal = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: `https://placehold.co/120x80/f59e0b/ffffff?text=${encodeURIComponent(shortenedName)}`,
      category: 'Electronics'
    };
    
    return (
      <TouchableOpacity
        style={styles.flashDealItem}
        onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
      >
        <Image source={{ uri: productForFlashDeal.image }} style={styles.flashDealImage} />
        <View style={styles.flashDealInfo}>
          <Text style={styles.flashDealPrice}>
            ${productForFlashDeal.price.toFixed(2)}
          </Text>
          <Text style={styles.flashDealDiscount}>50% OFF</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Update renderProduct to use handleAddToCart:
  const renderProduct = ({ item }: { item: Product }) => {
    const productForCard = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: `https://placehold.co/300x300/fbbf24/000000?text=${encodeURIComponent(item.name)}`,
      category: 'Electronics'
    };
    
    return (
      <View style={styles.productCardContainer}>
        <ProductCard
          product={productForCard}
          theme="yellow"
          onPress={() => {
            if (!isAuthenticated) {
              navigation.navigate("Login", { 
                returnTo: "Homepage",
                productId: item.id // Store the product ID to redirect after login
              });
              return;
            }
            
            // User is authenticated, proceed to product detail
            navigation.navigate("ProductDetail", { id: item.id });
          }}
          onAddToCart={() => handleAddToCart(item.id)}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Navbar */}
      <NavBar cartItemsCount={cartItemCount} theme="yellow" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section with search */}
        <LinearGradient
          colors={["#fbbf24", "#f59e0b", "#d97706"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Shop Smart, Shop Easy</Text>
            <Text style={styles.heroSubtitle}>
              Everything You Need, All in One Place
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for products..."
                placeholderTextColor="#666"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Category Menu */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === null && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === null && styles.selectedCategoryText,
                ]}
              >
                All Categories
              </Text>
            </TouchableOpacity>

            {displayCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Flash Deals */}
        <View style={styles.sectionContainer}>
          <LinearGradient
            colors={["#f59e0b", "#fbbf24"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.flashDealsHeader}
          >
            <View style={styles.sectionTitleContainer}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="flash" size={24} color="#fff" />
                <Text style={styles.sectionTitle}>Flash Deals</Text>
              </View>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllButtonText}>See All</Text>
              </TouchableOpacity>
            </View>

            {featuredLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 12, height: 150 }}
                contentContainerStyle={{ paddingBottom: 8, paddingTop: 4 }}
              >
                {displayFeaturedProducts.map((item, index) => {
                  // console.log(`Rendering flash deal #${index}:`, item.name, item.price);
                  
                  const productForFlashDeal = {
                    id: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    image: `https://placehold.co/120x80/f59e0b/ffffff?text=${encodeURIComponent(item.name.substring(0, 12))}`,
                  };
                  
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.flashDealItem, { marginRight: 12 }]}
                      onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
                    >
                      <Image source={{ uri: productForFlashDeal.image }} style={styles.flashDealImage} />
                      <View style={styles.flashDealInfo}>
                        <Text style={styles.flashDealPrice} numberOfLines={1}>
                          ${productForFlashDeal.price.toFixed(2)}
                        </Text>
                        <Text style={styles.flashDealDiscount}>50% OFF</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </LinearGradient>
        </View>

        {/* Main Products */}
        <View style={styles.sectionContainer}>
          <Text style={styles.productsTitle}>Products For You</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f59e0b" />
            </View>
          ) : (
            <FlatList
              data={displayProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.productsGrid}
              columnWrapperStyle={styles.productRow}
            />
          )}
        </View>
      </ScrollView>

      <CustomAlert
        visible={showAddToCartAlert}
        title="Added to Cart"
        message="Item successfully added to your cart"
        primaryAction={{
          text: "View Cart",
          onPress: () => navigation.navigate("Cart")
        }}
        secondaryAction={{
          text: "Continue Shopping",
          onPress: () => {}
        }}
        onClose={() => setShowAddToCartAlert(false)}
        type="success"
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const productWidth = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbeb",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 16,
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#78350f", // yellow-900
    textAlign: "center",
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: "row",
    marginTop: 16,
    width: "100%",
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#b45309",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categorySection: {
    backgroundColor: "#fef3c7", 
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: "#fde68a", 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
  },
  selectedCategoryButton: {
    backgroundColor: "#d97706", 
  },
  categoryButtonText: {
    color: "#92400e",
    fontWeight: "500",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "white",
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  flashDealsHeader: {
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, 
    elevation: 3,
    minHeight: 190,
    paddingBottom: 4,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginLeft: 8,
  },
  seeAllButton: {
    backgroundColor: "#fde68a", 
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seeAllButtonText: {
    color: "#92400e", 
    fontWeight: "600",
    fontSize: 14,
  },
  flashDealsList: {
    marginTop: 12,
  },
  flashDealItem: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    width: 120,
    height: 125, 
    borderWidth: 1,
    borderColor: "#fff5d2", 
  },
  flashDealImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
    backgroundColor: "#f59e0b",
  },
  flashDealInfo: {
    padding: 8,
    height: 45,
    justifyContent: "space-between", 
  },
  flashDealPrice: {
    color: "#b45309",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2, 
  },
  flashDealDiscount: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600",
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
  },
  productsGrid: {
    paddingBottom: 24,
    paddingHorizontal: 4,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCardContainer: {
    width: (width - 48) / 2, 
    marginHorizontal: 4,
  },
});

export default Homepage;