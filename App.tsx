import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// Public Screens
import Homepage from './screens/Homepage';
// import ProductDetailScreen from './screens/ProductDetailScreen';
// import ProfileScreen from './screens/ProfileScreen';
// import CartScreen from './screens/CartScreen';
// import DashboardScreen from './screens/DashboardScreen';
// import OrdersScreen from './screens/OrdersScreen';
// import WishlistScreen from './screens/WishlistScreen';
// import SettingsScreen from './screens/SettingsScreen';

// Define the navigator types
const Stack = createStackNavigator();

// Main App Component
function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Homepage" 
          screenOptions={{ headerShown: false }}
        >
          {/* Public screens */}
          <Stack.Screen name="Homepage" component={Homepage} />
          
          {/* Auth screens */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ presentation: 'modal' }}
          />
          
          {/* Uncomment these as you build the screens */}
          {/* <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
