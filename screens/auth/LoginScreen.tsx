import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Import the components we converted earlier
import AuthLayout from '../../layouts/AuthLayout';
import AuthFormContainer from '../../components/form/AuthFormContrainer';
import FormInput from '../../components/form/FormInput';
import FormError from '../../components/form/FormError';
import SubmitButton from '../../components/props/SubmitButton';
import AuthLinkFooter from '../../components/props/AuthLinkFooter';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const route = useRoute<RouteProp<RootStackParamList, 'Login'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();
  const { login } = useAuth();
  
  const returnTo = route.params?.returnTo || 'Homepage';

  const handleSubmit = async () => {
    // Validation
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Match the credentials format with your API
      const loginData = {
        login: identifier.trim(),  // Changed from identifier to login to match your API
        password
      };
      
      await login(loginData);
      
      // Handle navigation based on returnTo screen type
      switch (returnTo) {
        case 'Dashboard':
          navigation.navigate('Dashboard');
          break;
        case 'Profile':
          navigation.navigate('Profile');
          break;
        case 'ProductDetail':
          // If we don't have an ID to navigate with, go to a safe default
          navigation.navigate('Dashboard');
          break;
        case 'VendorDetail':
          // If we don't have a slug to navigate with, go to a safe default
          navigation.navigate('Dashboard');
          break;
        case 'Cart':
          navigation.navigate('Cart');
          break;
        case 'Homepage':
          navigation.navigate('Homepage');
          break;
        default:
          // Default fallback
          navigation.navigate('Homepage');
      }
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        errorMessage = errorResponse.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthFormContainer title="Welcome Back">
        <FormError error={error} />
        
        <View style={styles.form}>
          <FormInput
            id="identifier"
            name="identifier"
            type="text"
            value={identifier}
            onChangeText={setIdentifier}
            label="Email or Phone Number"
            required={true}
            keyboardType={identifier.includes('@') ? 'email-address' : 'default'}
            autoCapitalize="none"
            placeholder="Enter email or phone"
          />
          
          <FormInput
            id="password"
            name="password"
            type="password"
            value={password}
            onChangeText={setPassword}
            label="Password"
            required={true}
            secureTextEntry={true}
            placeholder="Enter password"
          />
          
          <SubmitButton
            loading={loading}
            loadingText="Logging in..."
            text="Login"
            onPress={handleSubmit}
          />
        </View>
        
        <AuthLinkFooter
          promptText="Don't have an account?"
          linkText="Register"
          linkTo="Register"
        />
      </AuthFormContainer>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    marginVertical: 8,
  },
});

export default LoginScreen;