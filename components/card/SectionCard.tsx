import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionCardProps {
  title: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, footerContent }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
      
      {footerContent && (
        <View style={styles.footer}>
          {footerContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 10,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // gray-200
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827', // gray-900
  },
  content: {
    // Content will be provided by children
  },
  footer: {
    backgroundColor: '#f9fafb', // gray-50
    paddingHorizontal: 16,
    paddingVertical: 16,
  }
});

export default SectionCard;