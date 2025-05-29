import React from 'react';
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  containerStyle?: StyleProp<ViewStyle>; 
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChangeText,
  label,
  required = false,
  minLength,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  containerStyle,
}) => {
  const getKeyboardType = () => {
    if (keyboardType) return keyboardType;
    
    switch (type) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'tel':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}{required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry || type === 'password'}
        keyboardType={getKeyboardType()}
        autoCapitalize={autoCapitalize || (type === 'email' ? 'none' : 'sentences')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#b45309',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  required: {
    color: '#dc2626',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  }
});

export default FormInput;