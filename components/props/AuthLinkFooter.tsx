import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface AuthLinkFooterProps {
  promptText: string;
  linkText: string;
  linkTo: string;
}

type RootStackParamList = {
  Main: undefined;
  [key: string]: undefined | object;
};

const AuthLinkFooter: React.FC<AuthLinkFooterProps> = ({ 
  promptText, 
  linkText, 
  linkTo 
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.promptText}>{promptText} </Text>
        <Text 
          style={styles.linkText}
          onPress={() => navigation.navigate(linkTo)}
        >
          {linkText}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.homeLink}
        onPress={() => navigation.navigate('Main')}
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
    color: '#d97706',
    fontSize: 14,
    marginLeft: 4,
  }
});

export default AuthLinkFooter;