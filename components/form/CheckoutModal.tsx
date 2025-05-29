import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

interface CheckoutFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (formData: OrderFormData) => void;
  isSubmitting: boolean;
  cart: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

export interface OrderFormData {
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string;
  payment_method: string;
  notes?: string;
}

const CheckoutModal: React.FC<CheckoutFormProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
  cart
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    shipping_name: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: '',
    shipping_phone: '',
    payment_method: 'credit_card',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.shipping_name.trim()) {
      newErrors.shipping_name = 'Name is required';
    }
    if (!formData.shipping_address_line1.trim()) {
      newErrors.shipping_address_line1 = 'Address is required';
    }
    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = 'City is required';
    }
    if (!formData.shipping_state.trim()) {
      newErrors.shipping_state = 'State is required';
    }
    if (!formData.shipping_postal_code.trim()) {
      newErrors.shipping_postal_code = 'Postal code is required';
    }
    if (!formData.shipping_country.trim()) {
      newErrors.shipping_country = 'Country is required';
    }
    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.shipping_phone.replace(/\D/g, ''))) {
      newErrors.shipping_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to first error (would need a ref implementation)
      Alert.alert('Form Error', 'Please fill in all required fields correctly');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Checkout</Text>
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.formScrollView}>
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Shipping Information</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[styles.input, errors.shipping_name ? styles.inputError : null]}
                  value={formData.shipping_name}
                  onChangeText={(text) => updateField('shipping_name', text)}
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                />
                {errors.shipping_name && (
                  <Text style={styles.errorText}>{errors.shipping_name}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Line 1 *</Text>
                <TextInput
                  style={[styles.input, errors.shipping_address_line1 ? styles.inputError : null]}
                  value={formData.shipping_address_line1}
                  onChangeText={(text) => updateField('shipping_address_line1', text)}
                  placeholder="123 Main Street"
                  placeholderTextColor="#9ca3af"
                />
                {errors.shipping_address_line1 && (
                  <Text style={styles.errorText}>{errors.shipping_address_line1}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Line 2</Text>
                <TextInput
                  style={styles.input}
                  value={formData.shipping_address_line2}
                  onChangeText={(text) => updateField('shipping_address_line2', text)}
                  placeholder="Apt, Suite, Unit, etc. (optional)"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={[styles.input, errors.shipping_city ? styles.inputError : null]}
                    value={formData.shipping_city}
                    onChangeText={(text) => updateField('shipping_city', text)}
                    placeholder="New York"
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.shipping_city && (
                    <Text style={styles.errorText}>{errors.shipping_city}</Text>
                  )}
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>State *</Text>
                  <TextInput
                    style={[styles.input, errors.shipping_state ? styles.inputError : null]}
                    value={formData.shipping_state}
                    onChangeText={(text) => updateField('shipping_state', text)}
                    placeholder="NY"
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.shipping_state && (
                    <Text style={styles.errorText}>{errors.shipping_state}</Text>
                  )}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Postal Code *</Text>
                  <TextInput
                    style={[styles.input, errors.shipping_postal_code ? styles.inputError : null]}
                    value={formData.shipping_postal_code}
                    onChangeText={(text) => updateField('shipping_postal_code', text)}
                    placeholder="10001"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                  />
                  {errors.shipping_postal_code && (
                    <Text style={styles.errorText}>{errors.shipping_postal_code}</Text>
                  )}
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Country *</Text>
                  <TextInput
                    style={[styles.input, errors.shipping_country ? styles.inputError : null]}
                    value={formData.shipping_country}
                    onChangeText={(text) => updateField('shipping_country', text)}
                    placeholder="United States"
                    placeholderTextColor="#9ca3af"
                  />
                  {errors.shipping_country && (
                    <Text style={styles.errorText}>{errors.shipping_country}</Text>
                  )}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, errors.shipping_phone ? styles.inputError : null]}
                  value={formData.shipping_phone}
                  onChangeText={(text) => updateField('shipping_phone', text)}
                  placeholder="555-123-4567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
                {errors.shipping_phone && (
                  <Text style={styles.errorText}>{errors.shipping_phone}</Text>
                )}
              </View>

              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formData.payment_method === 'credit_card' && styles.paymentOptionSelected
                  ]}
                  onPress={() => updateField('payment_method', 'credit_card')}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={formData.payment_method === 'credit_card' ? '#f59e0b' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      formData.payment_method === 'credit_card' && styles.paymentOptionTextSelected
                    ]}
                  >
                    Credit Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formData.payment_method === 'paypal' && styles.paymentOptionSelected
                  ]}
                  onPress={() => updateField('payment_method', 'paypal')}
                >
                  <Ionicons
                    name="logo-paypal"
                    size={24}
                    color={formData.payment_method === 'paypal' ? '#f59e0b' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      formData.payment_method === 'paypal' && styles.paymentOptionTextSelected
                    ]}
                  >
                    PayPal
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formData.payment_method === 'cash' && styles.paymentOptionSelected
                  ]}
                  onPress={() => updateField('payment_method', 'cash')}
                >
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={formData.payment_method === 'cash' ? '#f59e0b' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      formData.payment_method === 'cash' && styles.paymentOptionTextSelected
                    ]}
                  >
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Order Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => updateField('notes', text)}
                  placeholder="Special instructions for delivery"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${cart.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>${cart.tax.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${cart.total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>Place Order</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  formScrollView: {
    maxHeight: '80%',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    minHeight: 80,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  paymentOptionText: {
    marginLeft: 8,
    color: '#4b5563',
    fontWeight: '500',
  },
  paymentOptionTextSelected: {
    color: '#92400e',
  },
  orderSummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    color: '#111827',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f59e0b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
});

export default CheckoutModal;