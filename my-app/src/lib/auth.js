import { supabase } from './supabase';

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata (e.g., username)
 * @returns {Promise<{user, session, error}>}
 */
export async function signUp({ email, password, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Get the current user session
 * @returns {Promise<{session, error}>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

/**
 * Get the current user
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<{error}>}
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{user, error}>}
 */
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Listen to auth state changes
 * @param {function} callback - Callback function to handle auth state changes
 * @returns {object} Subscription object
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
