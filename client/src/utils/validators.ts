import { Alert } from 'react-native';

export const validateUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!regex.test(username)) {
    Alert.alert('Invalid Username', '3-20 chars, letters/numbers/underscore only.');
    return false;
  }
  return true;
};

export const validateUniqueIdSearch = (id: string): boolean => {
  const regex = /^[a-zA-Z0-9]{5,15}$/;
  if (!regex.test(id)) {
    Alert.alert('Invalid ID', '5-15 alphanumeric chars.');
    return false;
  }
  return true;
};

export const validatePostContent = (content: string): boolean => {
  if (content.length < 1 || content.length > 500) {
    Alert.alert('Invalid Post', '1-500 characters.');
    return false;
  }
  return true;
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 6) {
    Alert.alert('Weak Password', 'Minimum 6 characters.');
    return false;
  }
  return true;
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^s@]+@[^s@]+.[^s@]+$/;
  return regex.test(email);
};

export const validateAccessCode = (code: string): boolean => {
  // One-time 6-digit code
  const regex = /^d{6}$/;
  if (!regex.test(code)) {
    Alert.alert('Invalid Code', '6-digit code required.');
    return false;
  }
  return true;
};

// Form validation helper
export const validateSignupForm = (form: { username: string; email: string; password: string }) => {
  if (!validateUsername(form.username)) return false;
  if (!validateEmail(form.email)) {
    Alert.alert('Invalid Email');
    return false;
  }
  if (!validatePassword(form.password)) return false;
  return true;
};