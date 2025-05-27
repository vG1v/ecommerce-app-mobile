import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  showCount?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showCount = false,
  reviewCount
}) => {
  // Determine star size based on prop
  const getStarSize = () => {
    switch (size) {
      case 'sm':
      case 'small':
        return 12;
      case 'lg':
      case 'large':
        return 20;
      default:
        return 16; // md or medium
    }
  };
  
  const starSize = getStarSize();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Ionicons 
            key={`star-full-${index}`}
            name="star"
            size={starSize}
            color="#f59e0b" // amber-500
            style={styles.star}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <Ionicons
            key="star-half"
            name="star-half"
            size={starSize}
            color="#f59e0b" // amber-500
            style={styles.star}
          />
        )}
        
        {/* Empty stars */}
        {Array.from({ length: maxStars - fullStars - (hasHalfStar ? 1 : 0) }).map((_, index) => (
          <Ionicons
            key={`star-outline-${index}`}
            name="star-outline"
            size={starSize}
            color="#d1d5db" // gray-300
            style={styles.star}
          />
        ))}
      </View>
      
      {/* Review count */}
      {showCount && reviewCount !== undefined && (
        <Text style={styles.reviewCount}>({reviewCount})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 1,
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6b7280', // gray-500
  }
});

export default StarRating;