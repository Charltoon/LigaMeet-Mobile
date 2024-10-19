import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { resetPassword } from '../services/auth';

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setMessage('Password reset email sent.');
      navigation.navigate('Login');
    } catch (error) {
      setMessage('Password reset failed.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <Button title="Reset Password" onPress={handleResetPassword} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default ResetPassword;
