import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import APIService from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "../components/card/ProductCard";
import NavBar from "../components/layout/NavBar";

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          APIService.getProducts(),
          APIService.getCategories(),
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    };

    fetchData();
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
    // Search is handled in useEffect
  };

  const handleAddToCart = (productId: number) => {
    if (!isAuthenticated) {
      // Remove the returnTo parameter since we're simplifying navigation
      navigation.navigate("Login");
      return;
    }

    // Add to cart logic here
  };

  // Mock categories and featured products for initial display
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

  const mockProducts = [
    { id: 1, name: "Wireless Earbuds", price: 29.99, image: "https://placehold.co/300x300?text=Earbuds", category: "Electronics" },
    { id: 2, name: "Smart Watch", price: 89.99, image: "https://placehold.co/300x300?text=Watch", category: "Electronics" },
    { id: 3, name: "Summer T-Shirt", price: 19.99, image: "https://placehold.co/300x300?text=T-Shirt", category: "Fashion" },
    { id: 4, name: "Kitchen Blender", price: 49.99, image: "https://placehold.co/300x300?text=Blender", category: "Home & Kitchen" },
    { id: 5, name: "Bluetooth Speaker", price: 39.99, image: "https://placehold.co/300x300?text=Speaker", category: "Electronics" },
    { id: 6, name: "Running Shoes", price: 59.99, image: "https://placehold.co/300x300?text=Shoes", category: "Fashion" },
    { id: 7, name: "Coffee Maker", price: 69.99, image: "https://placehold.co/300x300?text=Coffee", category: "Home & Kitchen" },
    { id: 8, name: "Yoga Mat", price: 24.99, image: "https://placehold.co/300x300?text=Yoga", category: "Sports" },
  ];

  // Use mock data until API is implemented
  const displayCategories = categories.length ? categories : mockCategories;
  const displayProducts = loading ? mockProducts : filteredProducts;

  // Render item for category horizontal list
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render item for flash deals
  const renderFlashDeal = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.flashDealItem}
      onPress={() => navigation.navigate("ProductDetail", { id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.flashDealImage} />
      <View style={styles.flashDealInfo}>
        <Text style={styles.flashDealPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.flashDealDiscount}>50% OFF</Text>
      </View>
    </TouchableOpacity>
  );

  // Render item for product grid
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      theme="yellow"
      onPress={() => {
        navigation.navigate("ProductDetail", { id: item.id });
      }}
    />
  );

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

            <FlatList
              data={mockProducts.slice(0, 6)}
              renderItem={renderFlashDeal}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flashDealsList}
            />
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
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const productWidth = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // bg-gray-50
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
    backgroundColor: "#b45309", // amber-600
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categorySection: {
    backgroundColor: "#fef3c7", // amber-100
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
    backgroundColor: "#fde68a", // amber-200
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
  },
  selectedCategoryButton: {
    backgroundColor: "#d97706", // amber-600
  },
  categoryButtonText: {
    color: "#92400e", // amber-800
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
    backgroundColor: "#fde68a", // yellow-300
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seeAllButtonText: {
    color: "#92400e", // amber-800
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
    elevation: 1,
    width: 100,
  },
  flashDealImage: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
  },
  flashDealInfo: {
    padding: 8,
  },
  flashDealPrice: {
    color: "#b45309", // amber-700
    fontWeight: "700",
    fontSize: 14,
  },
  flashDealDiscount: {
    color: "#dc2626", // red-600
    fontSize: 12,
    fontWeight: "600",
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827", // gray-900
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
  },
  productsGrid: {
    paddingBottom: 24,
  },
});

export default Homepage;