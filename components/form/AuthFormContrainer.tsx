import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthFormContainerProps {
  children: React.ReactNode;
  title: string;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children, title }) => {
  return (
    <LinearGradient
      colors={['#fffbeb', '#fef3c7']} // amber-50 to yellow-50
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#fde68a', // amber-200
    marginHorizontal: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#92400e', // amber-800
    marginBottom: 24,
  }
});

export default AuthFormContainer;