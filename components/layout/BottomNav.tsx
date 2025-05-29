import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Homepage from '../../screens/Homepage';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

interface BottomNavProps {
  initialRouteName?: string;
  theme?: 'amber' | 'default';
}

const BottomNav: React.FC<BottomNavProps> = ({
  initialRouteName = 'Home',
  theme = 'amber'
}) => {
  // Amber theme colors based on your design system
  const amberTheme = {
    activeTintColor: '#f59e0b',      // amber-500
    inactiveTintColor: '#6b7280',    // gray-500
    backgroundColor: '#fffbeb',      // amber-50
    borderTopColor: '#fde68a',       // amber-200
  };

  const defaultTheme = {
    activeTintColor: '#2563eb',      // blue-600
    inactiveTintColor: '#6b7280',    // gray-500
    backgroundColor: '#ffffff',      // white
    borderTopColor: '#e5e7eb',       // gray-200
  };

  const colors = theme === 'amber' ? amberTheme : defaultTheme;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          // Updated to match your screen names
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.activeTintColor,
        tabBarInactiveTintColor: colors.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: colors.backgroundColor,
          borderTopColor: colors.borderTopColor,
          borderTopWidth: 1,
          // Premium shadow effects for depth
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: -3 },
          elevation: 5,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Categories" component={Homepage} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomNav;