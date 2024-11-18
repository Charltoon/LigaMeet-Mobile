import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { resetPassword } from '../services/auth';

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      await resetPassword(email);
      setMessage('Password reset email sent.');
      setLoading(false); // Hide loading indicator
      Alert.alert('Success', 'Password reset email sent.');
      navigation.navigate('Login');
    } catch (error) {
      setMessage('Password reset failed.');
      setLoading(false); // Hide loading indicator
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>Enter your email address to receive a password reset link.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#AAB0B7"
      />

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2D3D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAB0B7',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#D3DCE6',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1F2D3D',
  },
  resetButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: '#FF6F61',
    marginTop: 20,
  },
});

export default ResetPassword;
