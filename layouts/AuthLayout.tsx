import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const currentYear = new Date().getFullYear();

  return (
    <LinearGradient 
      colors={['#fef3c7', '#fef9c3']} // amber-100 to yellow-100
      style={styles.container}
    >
      {/* Decorative elements */}
      <View style={styles.topBar} />
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Logo and branding */}
            <TouchableOpacity 
              style={styles.logoContainer}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })} 
            >
              <View style={styles.iconContainer}>
                <Ionicons name="bag" size={36} color="#d97706" />
              </View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.taglineText}>Your premier shopping destination</Text>
            </TouchableOpacity>

            {/* Auth card with subtle shadow */}
            <View style={styles.card}>
              {/* Golden accent bar at top of card */}
              <LinearGradient 
                colors={['#fbbf24', '#f59e0b']}
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}}
                style={styles.accentBar} 
              />
              
              <View style={styles.cardContent}>
                {children}
              </View>
            </View>
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © {currentYear} Shop Gold. All rights reserved Vorn.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 10,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#f59e0b', 
  },
  decorCircle1: {
    position: 'absolute',
    top: -64,
    left: -64,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fcd34d',
    opacity: 0.2,
    transform: [{ rotate: '45deg' }],
  },
  decorCircle2: {
    position: 'absolute',
    top: height / 2 - 150,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#fde68a',
    opacity: 0.2,
  },
  decorCircle3: {
    position: 'absolute',
    bottom: -64,
    right: -64,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fbbf24',
    opacity: 0.2,
    transform: [{ rotate: '12deg' }],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e', 
  },
  taglineText: {
    marginTop: 4,
    fontSize: 14,
    color: '#d97706', 
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  accentBar: {
    height: 8,
  },
  cardContent: {
    padding: 24,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#b45309', // amber-700
    textAlign: 'center',
  },
});

export default AuthLayout;