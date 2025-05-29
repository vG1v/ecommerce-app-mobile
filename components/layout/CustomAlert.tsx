import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  primaryAction?: {
    text: string;
    onPress: () => void;
  };
  secondaryAction?: {
    text: string;
    onPress: () => void;
  };
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const { height } = Dimensions.get('window');

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  primaryAction,
  secondaryAction,
  onClose,
  type = 'success'
}) => {
  const slideAnim = useRef(new Animated.Value(-height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#fff';
      case 'error':
        return '#fff';
      case 'info':
        return '#fff';
      default:
        return '#fff';
    }
  };

  const getGradientColors = (): [string, string] => {
    switch (type) {
      case 'success':
        return ["#f59e0b", "#d97706"];
      case 'error':
        return ["#ef4444", "#b91c1c"];
      case 'info':
        return ["#3b82f6", "#1d4ed8"];
      default:
        return ["#f59e0b", "#d97706"];
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.alertContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <Ionicons name={getIconName()} size={28} color={getIconColor()} />
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {secondaryAction && (
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={() => {
                    secondaryAction.onPress();
                    onClose();
                  }}
                >
                  <Text style={styles.secondaryButtonText}>{secondaryAction.text}</Text>
                </TouchableOpacity>
              )}
              
              {primaryAction && (
                <TouchableOpacity 
                  style={[styles.primaryButton, type === 'success' ? styles.successButton : {}]}
                  onPress={() => {
                    primaryAction.onPress();
                    onClose();
                  }}
                >
                  <Text style={styles.primaryButtonText}>{primaryAction.text}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  alertContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1
  },
  closeButton: {
    padding: 4
  },
  content: {
    padding: 16
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8
  },
  secondaryButtonText: {
    color: '#4b5563',
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6
  },
  successButton: {
    backgroundColor: '#f59e0b'
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default CustomAlert;