import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator,KeyboardAvoidingView,Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import APIService from '../services/ApiService';

// Import your existing components
import FormInput from '../components/form/FormInput';
import FormError from '../components/form/FormError';
import SubmitButton from '../components/props/SubmitButton';
import Navbar from '../components/layout/NavBar';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation() as any;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Separate form data for profile and password
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
      
      // Get cart count
      APIService.getCart()
        .then(res => setCartItemCount(res.data.items.length))
        .catch(() => {});
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };

  const handleProfileSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await APIService.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join('. ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await APIService.updatePassword(passwordData);
      setSuccess('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join('. ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Navbar cartItemsCount={cartItemCount} theme="yellow" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar cartItemsCount={cartItemCount} theme="yellow" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Update Profile</Text>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Success/Error Messages */}
          {success ? (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}
          
          {error ? (
            <View style={styles.errorContainer}>
              <FormError error={error} />
            </View>
          ) : null}

          {/* Personal Information Section */}
          <View style={styles.formSection}>
            <LinearGradient
              colors={['#f59e0b', '#eab308']}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </LinearGradient>
            
            <View style={styles.sectionContent}>
              <FormInput
                id="name"
                name="name"
                type="text"
                value={profileData.name}
                onChangeText={(value) => handleProfileChange('name', value)}
                label="Name"
                required={true}
                placeholder="Enter your name"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChangeText={(value) => handleProfileChange('email', value)}
                label="Email"
                required={true}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                containerStyle={styles.inputContainer}
              />
              
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loading={loading}
                  loadingText="Updating..."
                  text="Update Profile"
                  onPress={handleProfileSubmit}
                />
              </View>
            </View>
          </View>

          {/* Change Password Section */}
          <View style={styles.formSection}>
            <LinearGradient
              colors={['#f59e0b', '#eab308']}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Change Password</Text>
            </LinearGradient>
            
            <View style={styles.sectionContent}>
              <FormInput
                id="current_password"
                name="current_password"
                type="password"
                value={passwordData.current_password}
                onChangeText={(value) => handlePasswordChange('current_password', value)}
                label="Current Password"
                required={true}
                secureTextEntry={true}
                placeholder="Enter current password"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="new_password"
                name="new_password"
                type="password"
                value={passwordData.new_password}
                onChangeText={(value) => handlePasswordChange('new_password', value)}
                label="New Password"
                required={true}
                minLength={8}
                secureTextEntry={true}
                placeholder="Enter new password"
                containerStyle={styles.inputContainer}
              />
              
              <FormInput
                id="new_password_confirmation"
                name="new_password_confirmation"
                type="password"
                value={passwordData.new_password_confirmation}
                onChangeText={(value) => handlePasswordChange('new_password_confirmation', value)}
                label="Confirm New Password"
                required={true}
                secureTextEntry={true}
                placeholder="Confirm new password"
                containerStyle={styles.inputContainer}
              />
              
              <View style={styles.buttonContainer}>
                <SubmitButton
                  loading={loading}
                  loadingText="Updating..."
                  text="Change Password"
                  onPress={handlePasswordSubmit}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // gray-50
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  backButton: {
    backgroundColor: '#fde68a', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#92400e', 
    fontWeight: '500',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5', // green-50
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#059669', // green-600
  },
  successText: {
    color: '#059669', // green-700
    marginLeft: 8,
    flex: 1,
  },
  errorContainer: {
    marginBottom: 24,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    padding: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default ProfileScreen;