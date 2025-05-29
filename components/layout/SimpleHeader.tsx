import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface SimpleHeaderProps {
  title?: string;
  showBack?: boolean;
  theme?: 'default' | 'yellow';
  rightComponent?: React.ReactNode;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ 
  title = 'E-Shop', 
  showBack = false, 
  theme = 'default',
  rightComponent
}) => {
  const navigation = useNavigation();
  const isYellow = theme === 'yellow';
  const bgColor = isYellow ? '#f59e0b' : '#ffffff';
  const textColor = isYellow ? '#78350f' : '#2563eb';
  
  return (
    <View style={[styles.header, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isYellow ? "dark-content" : "light-content"} />
      <View style={styles.container}>
        {showBack ? (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Text style={[styles.logo, { color: textColor }]}>{title}</Text>
          </View>
        )}
        
        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  logoContainer: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SimpleHeader;