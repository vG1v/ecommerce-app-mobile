import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  text: string;
  onPress?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  loading, 
  loadingText, 
  text,
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="white" size="small" style={styles.loader} />
          <Text style={styles.buttonText}>{loadingText}</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#d97706', // amber-600
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  }
});

export default SubmitButton;