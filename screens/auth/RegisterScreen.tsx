import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import APIService from '../../services/ApiService';

// Import the components we converted earlier
import AuthLayout from '../../layouts/AuthLayout';
import AuthFormContainer from '../../components/form/AuthFormContrainer';
import FormInput from '../../components/form/FormInput';
import FormError from '../../components/form/FormError';
import SubmitButton from '../../components/props/SubmitButton';
import AuthLinkFooter from '../../components/props/AuthLinkFooter';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation() as any;

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate passwords match
      if (formData.password !== formData.password_confirmation) {
        throw new Error('Passwords do not match');
      }
      
      // Register user
      await APIService.register(formData);
      
      // Simplified: Just navigate to Login after successful registration
      navigation.navigate('Login');
      
    } catch (err: any) {
      // Handle API errors
      if (err.response && 'data' in err.response) {
        const responseData = err.response.data;
        if (responseData && typeof responseData === 'object' && 'errors' in responseData) {
          const errorMessages = Object.values(responseData.errors as Record<string, string[]>)
            .flat()
            .join('. ');
          setError(errorMessages);
        } else {
          setError((responseData as any)?.message || 'Registration failed');
        }
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <AuthFormContainer title="Create an Account">
            <FormError error={error} />
            
            <View style={styles.form}>
              <FormInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                label="Name"
                required={true}
                placeholder="Enter your name"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                label="Email"
                required={true}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChangeText={(value) => handleChange('phone_number', value)}
                label="Phone Number"
                required={true}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                label="Password"
                required={true}
                minLength={8}
                secureTextEntry={true}
                placeholder="Enter password"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChangeText={(value) => handleChange('password_confirmation', value)}
                label="Confirm Password"
                required={true}
                secureTextEntry={true}
                placeholder="Confirm your password"
                containerStyle={styles.inputContainer}
              />
              
              <SubmitButton
                loading={loading}
                loadingText="Creating Account..."
                text="Register"
                onPress={handleSubmit}
              />
            </View>
            
            <AuthLinkFooter
              promptText="Already have an account?"
              linkText="Login"
              linkTo="Login"
            />
          </AuthFormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  form: {
    width: '100%',
    marginVertical: 4,
  },
  inputContainer: {
    marginBottom: 8, 
  }
});

export default RegisterScreen;