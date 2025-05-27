import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SortOption {
  value: string;
  label: string;
}

interface SortToolbarProps {
  count: number;
  itemName: string;
  sortOptions: SortOption[];
  currentSort: string;
  onSortChange: (value: string) => void;
}

const SortToolbar: React.FC<SortToolbarProps> = ({
  count,
  itemName,
  sortOptions,
  currentSort,
  onSortChange
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.countText}>
        {count} {count === 1 ? itemName : `${itemName}s`} found
      </Text>
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentSort}
            onValueChange={(itemValue) => onSortChange(itemValue as string)}
            style={styles.picker}
            dropdownIconColor="#4b5563"
          >
            {sortOptions.map(option => (
              <Picker.Item 
                key={option.value} 
                label={option.label} 
                value={option.value}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde68a', // amber-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  countText: {
    fontSize: 14,
    color: '#4b5563', // gray-600
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: 8,
    fontSize: 14,
    color: '#4b5563', // gray-600
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 4,
    overflow: 'hidden',
    minWidth: 120,
  },
  picker: {
    height: 40,
    width: 150,
  },
  pickerItem: {
    fontSize: 14,
  }
});

export default SortToolbar;