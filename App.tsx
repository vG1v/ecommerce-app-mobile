import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './contexts/AuthContext';

// Import screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import Homepage from './screens/Homepage';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for main app screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Categories" component={Homepage} />
      <Tab.Screen name="Profile" component={Homepage} />
    </Tab.Navigator>
  );
}

// Root stack that contains both tab navigation and auth screens
function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: 'white' }
          }}
        >
          {/* Main tabs with NO animation */}
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
          />
          
          {/* Auth screens WITH stack animation */}
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              cardStyle: { backgroundColor: 'white' },
              // Default animation is enabled (no need to specify)
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{
              cardStyle: { backgroundColor: 'white' },
              // Default animation is enabled (no need to specify)
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
