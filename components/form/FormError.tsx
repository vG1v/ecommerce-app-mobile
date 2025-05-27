import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FormErrorProps {
  error: string;
}

const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef2f2', // red-50
    borderColor: '#fee2e2', // red-100
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626', // red-600
    fontSize: 14,
  }
});

export default FormError;