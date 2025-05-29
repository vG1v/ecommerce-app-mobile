import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, StyleSheet, Alert, SafeAreaView, 
  Text, TouchableOpacity, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/layout/NavBar';
import { PHYSICAL_DEVICE_URL } from '@env';

const API_URL_KEY = 'CUSTOM_API_URL';

const DeveloperSettingsScreen = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    loadSavedUrl();
  }, []);
  
  const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
      if (savedUrl) {
        setApiUrl(savedUrl);
      } else {
        // Default to env variable if no saved URL
        setApiUrl(PHYSICAL_DEVICE_URL || 'http://192.168.0.1:8000/api');
      }
    } catch (e) {
      console.error('Failed to load API URL');
    }
  };
  
  const saveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'API URL cannot be empty');
      return;
    }
    
    try {
      setIsSaving(true);
      await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
      Alert.alert(
        'Success', 
        'API URL updated. Please restart the app for changes to take effect.'
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to save API URL');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <NavBar theme="yellow" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Developer Settings</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>API Configuration</Text>
          <Text style={styles.description}>
            Change the API URL when testing on different networks.
            You'll need to restart the app after changing this setting.
          </Text>
          
          <Text style={styles.label}>Backend API URL:</Text>
          <TextInput 
            value={apiUrl}
            onChangeText={setApiUrl}
            style={styles.input}
            placeholder="http://192.168.x.x:8000/api"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveApiUrl}
            disabled={isSaving}
          >
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save API URL'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.note}>
            Note: This setting is intended for development and testing purposes only.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    marginBottom: 16,
  },
  saveButton: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  }
});

export default DeveloperSettingsScreen;