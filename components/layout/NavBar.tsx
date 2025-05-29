import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
    cartItemsCount?: number;
    theme?: 'default' | 'yellow';
}


const Navbar: React.FC<NavbarProps> = ({ cartItemsCount = 0, theme = 'default' }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigation = useNavigation() as any;

    const isYellow = theme === 'yellow';

    const handleLogout = async () => {
        await logout();
    };

    // Theme colors
    const navBgColor = isYellow ? '#f59e0b' : '#ffffff';
    const textColor = isYellow ? '#92400e' : '#111827';
    const logoColor = isYellow ? '#78350f' : '#2563eb';
    const buttonBgColor = isYellow ? '#b45309' : '#2563eb';
    const secondaryButtonBg = isYellow ? '#fef3c7' : '#f3f4f6';
    const secondaryButtonText = isYellow ? '#92400e' : '#4b5563';

    return (
        <View style={[styles.navbar, { backgroundColor: navBgColor }]}>
            <StatusBar barStyle={isYellow ? "dark-content" : "light-content"} />

            {/* Main Navbar */}
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Homepage')}
                    style={styles.logoContainer}
                >
                    <Text style={[styles.logo, { color: logoColor }]}>E-Shop</Text>
                </TouchableOpacity>

                {/* Right side - User controls */}
                <View style={styles.rightControls}>
                    {user ? (
                        <View style={styles.userControls}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => {}}
                            >
                                <Ionicons name="heart-outline" size={24} color={textColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => {}}
                            >
                                <Ionicons name="cart-outline" size={24} color={textColor} />
                                {cartItemsCount > 0 && (
                                    <View style={[styles.badge, { backgroundColor: '#dc2626' }]}>
                                        <Text style={styles.badgeText}>{cartItemsCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => setIsMenuOpen(true)}
                            >
                                <Ionicons name="person-circle-outline" size={26} color={textColor} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.authButtons}>
                            <TouchableOpacity
                                style={[styles.loginButton, { backgroundColor: buttonBgColor }]}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.registerButton, { backgroundColor: secondaryButtonBg }]}
                                onPress={() => navigation.navigate('Register')}
                            >
                                <Text style={[styles.registerButtonText, { color: secondaryButtonText }]}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Mobile menu button */}
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setIsMenuOpen(true)}
                    >
                        <Ionicons name="menu" size={24} color={textColor} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mobile Menu Modal */}
            <Modal
                visible={isMenuOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsMenuOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.mobileMenu, { backgroundColor: isYellow ? '#fffbeb' : '#ffffff' }]}>
                        <View style={styles.mobileMenuHeader}>
                            <Text style={[styles.mobileMenuTitle, { color: textColor }]}>Menu</Text>
                            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                                <Ionicons name="close" size={24} color={textColor} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mobileMenuItems}>
                            {/* User specific items if logged in */}
                            {user && (
                                <View style={styles.mobileUserSection}>
                                    <View style={styles.mobileUserInfo}>
                                        <View style={[styles.avatarIcon, { backgroundColor: isYellow ? '#fde68a' : '#e5e7eb' }]}>
                                            <Text style={[styles.avatarText, { color: isYellow ? '#92400e' : '#4b5563' }]}>
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </Text>
                                        </View>
                                        <View style={styles.userTextInfo}>
                                            <Text style={[styles.userName, { color: textColor }]}>{user.name}</Text>
                                            <Text style={styles.userEmail}>{user.email}</Text>
                                        </View>
                                    </View>

                                    {/* Simple menu items without complex navigation */}
                                    <TouchableOpacity
                                        style={styles.mobileMenuItem}
                                        onPress={() => {
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.mobileMenuItemText, { color: textColor }]}>
                                            Your Profile
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.mobileMenuItem}
                                        onPress={() => {
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.mobileMenuItemText, { color: textColor }]}>
                                            Your Orders
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={styles.mobileMenuItem}
                                        onPress={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        <Text style={[styles.mobileMenuItemText, { color: textColor }]}>
                                            Sign out
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Auth buttons if not logged in */}
                            {!user && (
                                <View style={styles.mobileAuthButtons}>
                                    <TouchableOpacity
                                        style={[styles.mobileLoginButton, { backgroundColor: buttonBgColor }]}
                                        onPress={() => {
                                            navigation.navigate('Login');
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Text style={styles.mobileLoginButtonText}>Login</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.mobileRegisterButton, { backgroundColor: secondaryButtonBg }]}
                                        onPress={() => {
                                            navigation.navigate('Register');
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <Text style={[styles.mobileRegisterButtonText, { color: secondaryButtonText }]}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
    },
    logoContainer: {
        paddingVertical: 8,
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    navigationHidden: {
        display: 'none', // Hidden on mobile
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: 2,
        top: 2,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    authButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    registerButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    registerButtonText: {
        fontWeight: '500',
        fontSize: 14,
    },
    menuButton: {
        padding: 8,
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mobileMenu: {
        marginTop: 'auto',
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        padding: 16,
    },
    mobileMenuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    mobileMenuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mobileMenuItems: {
        paddingTop: 16,
    },
    mobileMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 4,
        position: 'relative',
    },
    mobileMenuItemText: {
        fontSize: 16,
    },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        top: 12,
        bottom: 12,
        width: 3,
        borderRadius: 2,
    },
    mobileUserSection: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 16,
    },
    mobileUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    avatarIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
    },
    userTextInfo: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
    },
    mobileAuthButtons: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    mobileLoginButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    mobileLoginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    mobileRegisterButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    mobileRegisterButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Navbar;