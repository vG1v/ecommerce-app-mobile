import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from '../props/StarRating';

interface VendorCardProps {
    vendor: {
        id: number;
        name: string;
        slug: string;
        logo: string;
        coverImage: string;
        shortDescription: string;
        productCount: number;
        rating: number;
        reviewCount: number;
        verified: boolean;
        featured: boolean;
        location: string;
    };
    onPress: (slug: string) => void;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(vendor.slug)}
            style={styles.card}
            activeOpacity={0.7}
        >
            {/* Cover Image */}
            <View style={styles.coverContainer}>
                <Image
                    source={{ uri: vendor.coverImage }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />
                {vendor.featured && (
                    <View style={styles.featuredBadge}>
                        <Ionicons name="star" size={12} color="white" style={styles.featuredIcon} />
                        <Text style={styles.featuredText}>Featured</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                {/* Vendor Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={{ uri: vendor.logo }}
                            style={styles.logo}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    {/* Vendor Name */}
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{vendor.name}</Text>
                        {vendor.verified && (
                            <Ionicons 
                              name="checkmark-circle" 
                              size={18} 
                              color="#f59e0b" 
                              style={styles.verifiedIcon} 
                            />
                        )}
                    </View>

                    {/* Short Description */}
                    <Text 
                      style={styles.description}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                        {vendor.shortDescription}
                    </Text>

                    {/* Rating and Products */}
                    <View style={styles.statsContainer}>
                        <View style={styles.rating}>
                            <StarRating rating={vendor.rating} showCount={true} reviewCount={vendor.reviewCount} size="small" />
                        </View>
                        <Text style={styles.productCount}>
                            {vendor.productCount} Products
                        </Text>
                    </View>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={12} color="#9ca3af" style={styles.locationIcon} />
                        <Text style={styles.location}>{vendor.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#fef3c7', // amber-100
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 16,
    },
    coverContainer: {
        height: 128,
        backgroundColor: '#d97706', // amber-600
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#f59e0b', // amber-500
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredIcon: {
        marginRight: 4,
    },
    featuredText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    content: {
        padding: 16,
    },
    logoContainer: {
        position: 'relative',
        marginTop: -48,
        alignItems: 'center',
    },
    logoWrapper: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'white',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#78350f', // amber-900
    },
    verifiedIcon: {
        marginLeft: 6,
    },
    description: {
        marginTop: 4,
        color: '#4b5563', // gray-600
        fontSize: 14,
        textAlign: 'center',
        height: 40, // approximately 2 lines
    },
    statsContainer: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#92400e', // amber-800
    },
    locationContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6', // gray-100
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationIcon: {
        marginRight: 4,
    },
    location: {
        fontSize: 12,
        color: '#6b7280', // gray-500
    }
});

export default VendorCard;