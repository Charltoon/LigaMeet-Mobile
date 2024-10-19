import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example of using Anon Key for testing
export const testRegisterUser = async (email, password) => {
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
