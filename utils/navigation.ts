import { ParamListBase } from '@react-navigation/native';

// Type-safe navigation function
export function navigateSafely<T extends ParamListBase>(
  navigation: any, 
  routeName: keyof T,
  params?: any
) {
  switch (routeName as string) {
    case 'ProductDetail':
      if (params?.id) {
        navigation.navigate(routeName, params);
      } else {
        navigation.navigate('Homepage');
      }
      break;
    case 'VendorDetail':
      if (params?.slug) {
        navigation.navigate(routeName, params);
      } else {
        navigation.navigate('Homepage');
      }
      break;
    // Routes with optional parameters
    case 'Login':
      navigation.navigate(routeName, params || {});
      break;
    // Routes with no parameters
    default:
      navigation.navigate(routeName);
  }
}