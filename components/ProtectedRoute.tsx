import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

interface ProtectedScreenProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedScreenProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Effect to navigate away if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Use the current route name from the route object
      const currentRouteName = route.name;
      
      // Navigate to login and pass the return screen as a parameter
      navigation.replace('Login', { 
        returnTo: currentRouteName || 'Dashboard'
      } as any);
    }
  }, [isAuthenticated, loading, navigation, route]);

  if (loading) {
    // Show loading spinner while checking auth status
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d97706" />
      </View>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  }
});

export default ProtectedRoute;