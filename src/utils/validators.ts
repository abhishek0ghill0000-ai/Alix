// src/utils/validators.ts
import type { LoginRequest, SignupRequest } from '../types/api';

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[6-9]d{9}$/;
  if (!phone) return 'Phone number is required';
  if (phone.length !== 10) return 'Phone number must be 10 digits';
  if (!phoneRegex.test(phone)) return 'Invalid phone number';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 20) return 'Password too long';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) return 'Name is required';
  if (name.trim().length < 2) return 'Name too short';
  if (name.length > 30) return 'Name too long';
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
  if (!email) return null; // Email optional
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validateLogin = (data: LoginRequest): string | null => {
  const phoneError = validatePhone(data.phone);
  if (phoneError) return phoneError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) return passwordError;
  
  return null;
};

export const validateSignup = (data: SignupRequest): string | null => {
  const phoneError = validatePhone(data.phone);
  if (phoneError) return phoneError;
  
  const nameError = validateName(data.name);
  if (nameError) return nameError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) return passwordError;
  
  return null;
};

// Chat message validation
export const validateMessage = (text: string): boolean => {
  return text.trim().length > 0 && text.trim().length <= 1000;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};