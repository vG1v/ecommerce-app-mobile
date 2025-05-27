import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

interface MenuItem {
  label: string;
  to?: keyof RootStackParamList;
  onClick?: () => void;
  type?: 'link' | 'button';
}

interface DropdownMenuProps {
  userName: string;
  userEmail?: string;
  menuItems: MenuItem[];
  theme?: 'default' | 'yellow';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  userName, 
  userEmail, 
  menuItems,
  theme = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const isYellow = theme === 'yellow';
  
  // Theme-specific colors
  const avatarBgColor = isYellow ? '#fde68a' : '#e5e7eb';
  const avatarTextColor = isYellow ? '#92400e' : '#4b5563';
  const menuBgColor = isYellow ? '#fffbeb' : '#ffffff';
  const menuItemTextColor = isYellow ? '#92400e' : '#374151';
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setIsOpen(true)}
        style={styles.avatarButton}
      >
        <View style={[styles.avatar, { backgroundColor: avatarBgColor }]}>
          <Text style={[styles.avatarText, { color: avatarTextColor }]}>
            {userName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={[styles.dropdown, { backgroundColor: menuBgColor }]}>
                {userEmail && (
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                  </View>
                )}
                
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => {
                      setIsOpen(false);
                      if (item.type === 'button' && item.onClick) {
                        item.onClick();
                      } else if (item.to) {
                        navigation.navigate(item.to as any);
                      }
                    }}
                  >
                    <Text style={[styles.menuItemText, { color: menuItemTextColor }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64,
    paddingRight: 16,
  },
  dropdown: {
    minWidth: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  userInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  menuItem: {
    padding: 12,
  },
  menuItemText: {
    fontSize: 14,
  }
});

export default DropdownMenu;