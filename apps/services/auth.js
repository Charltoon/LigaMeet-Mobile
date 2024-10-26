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

  if (!identifier.includes('@')) {
    const { data, error } = await supabase
      .from('auth_user')
      .select('email')
      .eq('username', identifier)
      .single();

    if (error || !data) {
      console.error('Error fetching user:', error?.message || 'No user found with that username');
      throw new Error(`No user found with username: ${identifier}`);
    }

    email = data.email;
  }

  const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error('Error logging in:', loginError.message);
    throw loginError;
  }

  if (authData?.user) {
    await AsyncStorage.setItem('userSession', JSON.stringify({ 
      email: authData.user.email, 
      username: identifier.includes('@') ? authData.user.username : identifier 
    }));
  } else {
    console.error('Login user is undefined');
  }

  return authData.user;
};


export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
  console.log('Data in loginUser:', data);

  if (data.user) {
    await AsyncStorage.setItem('userSession', JSON.stringify(data.user));
  } else {
    console.error('Login user is undefined');
  }

  return data.user;
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
