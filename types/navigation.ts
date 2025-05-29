import { ParamListBase } from '@react-navigation/native'

export type RootStackParamList = {
  // Root stack routes
  Main: { screen?: 'Home' | 'Categories' | 'Profile' | 'Cart' } | undefined
  Login: { message?: string; returnTo?: keyof RootStackParamList } | undefined
  Register: undefined
  
  // Other routes
  Dashboard: undefined
  Profile: undefined
  ProductDetail: { id: number }
  VendorDetail: { slug: string }
  Cart: undefined
  Orders: undefined
  Wishlist: undefined
  Settings: undefined
}

// Save navigation
export function navigateSafely<
  T extends ParamListBase
>(
  navigation: any,
  routeName: keyof T,
  params?: any
) {
  switch (routeName as string) {
    case 'ProductDetail':
      if (params?.id) {
        navigation.navigate(routeName, params)
      } else {
        // Navigate to home tab instead of Homepage
        navigation.navigate('Main', { screen: 'Home' })
      }
      break

    case 'VendorDetail':
      if (params?.slug) {
        navigation.navigate(routeName, params)
      } else {
        navigation.navigate('Main', { screen: 'Home' })
      }
      break

    // Routes with optional parameters
    case 'Login':
      navigation.navigate(routeName, params || {})
      break

    case 'Main':
      // Handle nested tab navigation
      if (params?.screen) {
        navigation.navigate(routeName, params)
      } else {
        navigation.navigate(routeName)
      }
      break

    // All other routes (no params)
    default:
      navigation.navigate(routeName)
  }
}
