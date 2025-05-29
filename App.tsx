import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';

// Import screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import BottomNav from './components/layout/BottomNav';

// Create navigators
const Stack = createStackNavigator();

// Create a wrapper component outside the App function
const MainScreen = () => <BottomNav theme="amber" />;

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
          {/* Use the wrapper component */}
          <Stack.Screen 
            name="Main" 
            component={MainScreen} 
            options={{
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              cardStyle: { backgroundColor: 'white' },
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{
              cardStyle: { backgroundColor: 'white' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
