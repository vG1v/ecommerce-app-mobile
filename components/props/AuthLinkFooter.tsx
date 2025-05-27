import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';

interface AuthLinkFooterProps {
  promptText: string;
  linkText: string;
  linkTo: keyof RootStackParamList;
}

const AuthLinkFooter: React.FC<AuthLinkFooterProps> = ({ 
  promptText, 
  linkText, 
  linkTo 
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.promptText}>{promptText} </Text>
        <Text 
          style={styles.linkText}
          onPress={() => navigation.navigate(linkTo as any)}
        >
          {linkText}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.homeLink}
        onPress={() => navigation.navigate('Homepage')}
      >
        <Ionicons name="arrow-back" size={16} color="#d97706" />
        <Text style={styles.homeLinkText}>Back to Homepage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  promptText: {
    color: '#b45309', 
  },
  linkText: {
    color: '#d97706',
    fontWeight: '500',
  },
  homeLink: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeLinkText: {
    color: '#d97706', // amber-600
    fontSize: 14,
    marginLeft: 4,
  }
});

export default AuthLinkFooter;