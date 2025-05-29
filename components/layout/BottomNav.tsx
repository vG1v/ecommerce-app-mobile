import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Homepage from '../../screens/Homepage';
// Import other screens as you build them

const Tab = createBottomTabNavigator();

interface BottomNavProps {
  initialRouteName?: string;
  backgroundColor?: string;
  activeTintColor?: string;
  inactiveTintColor?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  initialRouteName = 'Home',
  backgroundColor = '#FFFFFF',
  activeTintColor = '#2563eb',
  inactiveTintColor = '#6B7280',
}) => {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          // Define icons for each tab
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Products':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Dashboard':
              iconName = focused ? 'apps' : 'apps-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          // Optional: add shadow effects
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: -3 },
          elevation: 5,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Products" component={Homepage} />
      <Tab.Screen name="Dashboard" component={Homepage} />
    </Tab.Navigator>
  );
};

export default BottomNav;