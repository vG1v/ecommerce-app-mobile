import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';

interface FilterCategory {
  id: number;
  name: string;
  count: number;
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  selectedCategory: number | null;
  onCategoryChange: (id: number) => void;
  showVerifiedOnly?: boolean;
  onVerifiedChange?: (value: boolean) => void;
  minRating?: number;
  onRatingChange?: (rating: number) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showVerifiedOnly = false,
  onVerifiedChange,
  minRating,
  onRatingChange
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Filters</Text>
        
        {/* Category Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View>
            <TouchableOpacity 
              style={[
                styles.categoryItem, 
                selectedCategory === null && styles.selectedCategoryItem
              ]}
              onPress={() => onCategoryChange(-1)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === null && styles.selectedCategoryText
              ]}>
                All Categories
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={[
                  styles.categoryItem, 
                  selectedCategory === category.id && styles.selectedCategoryItem
                ]}
                onPress={() => onCategoryChange(category.id)}
              >
                <View style={styles.categoryRow}>
                  <Text style={[
                    styles.categoryText, 
                    selectedCategory === category.id && styles.selectedCategoryText
                  ]}>
                    {category.name}
                  </Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{category.count}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Verified Filter */}
        {onVerifiedChange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => onVerifiedChange(!showVerifiedOnly)}
            >
              <View style={styles.checkbox}>
                {showVerifiedOnly && (
                  <Ionicons name="checkmark" size={16} color="#d97706" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Verified only</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Ratings Filter */}
        {onRatingChange && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            {[4, 3, 2, 1].map((rating) => (
              <TouchableOpacity 
                key={rating}
                style={styles.ratingRow}
                onPress={() => onRatingChange(rating)}
              >
                <View style={styles.radioButton}>
                  {minRating === rating && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <View style={styles.ratingContainer}>
                  <StarRating rating={rating} size="sm" />
                  <Text style={styles.ratingText}> & up</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a', // amber-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    color: '#92400e', // amber-800
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563', // gray-700
    marginBottom: 8,
  },
  categoryItem: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  selectedCategoryItem: {
    backgroundColor: '#fef3c7', // amber-100
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: '#4b5563', // gray-600
  },
  selectedCategoryText: {
    color: '#92400e', // amber-800
  },
  countBadge: {
    backgroundColor: '#f3f4f6', // gray-100
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#4b5563', // gray-600
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4b5563', // gray-700
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d97706', // amber-600
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#d97706', // amber-600
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#4b5563', // gray-700
    marginLeft: 4,
  }
});

export default FilterSidebar;