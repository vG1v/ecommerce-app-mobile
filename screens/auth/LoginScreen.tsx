import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

// Import components
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
  
  const navigation = useNavigation() as any;
  const { login } = useAuth();

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
      const loginData = {
        login: identifier.trim(),
        password
      };
      
      await login(loginData);
      
      navigation.navigate('Main', { screen: 'Home' });
      
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