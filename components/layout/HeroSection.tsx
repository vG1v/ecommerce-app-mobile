import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import SearchBar from '../props/SearchBar';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  overlayColor?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  searchValue?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  overlayColor = 'rgba(180, 83, 9, 0.7)', 
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue = ''
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: backgroundImage }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          
          {onSearch && (
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchValue}
                onChangeText={onSearch}
                placeholder={searchPlaceholder}
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fef3c7', // amber-100
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  searchContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 16,
  }
});

export default HeroSection;