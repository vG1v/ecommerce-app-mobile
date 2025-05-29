import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons'; 
import { navigateSafely } from '../../types/navigation';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  linkText: string;
  linkUrl: keyof RootStackParamList;
  bgColor?: string;
  theme?: 'default' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  linkText, 
  linkUrl, 
  bgColor = '#3b82f6',
  theme = 'default'
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const isYellow = theme === 'yellow';
  
  const cardStyles = isYellow ? {
    borderColor: '#fde68a',
    footerBg: '#fffbeb',
    titleColor: '#b45309',
    valueColor: '#92400e',
    linkColor: '#d97706'
  } : {
    borderColor: '#e5e7eb',
    footerBg: '#f9fafb',
    titleColor: '#6b7280',
    valueColor: '#111827',
    linkColor: '#2563eb'
  };

  return (
    <View style={[styles.card, { borderColor: cardStyles.borderColor }]}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: cardStyles.titleColor }]}>{title}</Text>
            <Text style={[styles.value, { color: cardStyles.valueColor }]}>{value}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.footer, { backgroundColor: cardStyles.footerBg, borderColor: cardStyles.borderColor }]}>
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => navigateSafely(navigation, linkUrl)}
          activeOpacity={0.7}
        >
          <Text style={[styles.linkText, { color: cardStyles.linkColor }]}>{linkText}</Text>
          <Ionicons 
            name="arrow-forward" 
            size={16} 
            color={cardStyles.linkColor} 
            style={styles.linkIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
    transform: [{ scale: 1 }], // We'll handle the hover scale in the onPress event
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  linkIcon: {
    marginLeft: 4,
  }
});

export default StatCard;