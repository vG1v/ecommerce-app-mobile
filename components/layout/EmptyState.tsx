import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    actionText,
    onAction,
    icon
}) => {
    return (
        <View style={styles.container}>
            {icon || (
                <Ionicons name="sad-outline" size={48} color="#f59e0b" style={styles.icon} />
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {actionText && onAction && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={onAction}
                >
                    <Text style={styles.buttonText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fde68a', // amber-200
        padding: 24,
        alignItems: 'center',
        marginVertical: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#78350f', // amber-900
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#6b7280', // gray-500
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#fef3c7', // amber-100
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginTop: 8,
    },
    buttonText: {
        color: '#b45309', // amber-700
        fontSize: 14,
        fontWeight: '500',
    }
});

export default EmptyState;