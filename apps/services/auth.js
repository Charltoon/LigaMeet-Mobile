import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// auth.js
export const registerUser = async (username, email, password) => {
  try {
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), 5000);
    
    let response = await fetch('http://192.168.1.2:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let json = await response.json();
    if (response.status === 200) {
      console.log(json.message);
      Alert.alert('Success', 'User registered successfully');
    } else {
      console.error(json.error);
      Alert.alert('Error', json.error);
    }
} catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
      Alert.alert('Error', 'Network request timed out');
    } else {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to register user');
    }
  }
};

export const loginUserWithUsername = async (identifier, password) => {
  let email = identifier;
  let username = identifier;

  if (!identifier.includes('@')) {
    // Fetch the email associated with the username from Supabase
    const { data, error } = await supabase
      .from('auth_user')
      .select('email, username')
      .eq('username', identifier)
      .single();

    if (error || !data) {
      console.error('Error fetching user:', error?.message || 'No user found with that username');
      Alert.alert('Error', 'Invalid username or email');
      throw new Error(`No user found with username: ${identifier}`);
    }
    email = data.email;
    username = data.username;
  }
  
  try {
    const response = await fetch('http://192.168.1.2:8000/login/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Login successful:', result.message);
      await AsyncStorage.setItem('userSession', JSON.stringify({
        email: email,
        username: username,
      }));
      return result;
    } else {
      console.error('Login error:', result.error);
      Alert.alert('Error', result.error || 'Invalid login credentials');
      throw new Error(result.error || 'Login failed');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    Alert.alert('Error', 'Failed to login');
    throw error;
  }
};



export const logoutUser = async () => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem('userSession');
};

export const getUserSession = async () => {
  const session = await AsyncStorage.getItem('userSession');
  return session ? JSON.parse(session) : null;
};



export const resetPassword = async (email) => {
  const { error } = await supabase.auth.api.resetPasswordForEmail(email);
  if (error) {
    console.error('Error resetting password:', error.message);
    throw error;
  }
  return true;
};
