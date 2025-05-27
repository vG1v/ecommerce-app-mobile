export type RootStackParamList = {
  Login: { message?: string; returnTo?: keyof RootStackParamList } | undefined;
  Register: undefined;
  Dashboard: undefined;
  Profile: undefined;
  ProductDetail: { id: number };
  VendorDetail: { slug: string };
  Cart: undefined;
  Homepage: undefined;
  // Add these missing routes:
  Orders: undefined;
  Wishlist: undefined;
  Settings: undefined;
};