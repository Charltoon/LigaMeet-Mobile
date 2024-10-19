import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
  console.log('User in registerUser:', user);
  return user;
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
