import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const CommonButton: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  style,
  children,
  ...props
}) => {
  const getButtonStyle = () => {
    const base = styles.button;
    const variants = {
      primary: [styles.primary],
      secondary: [styles.secondary],
      outline: [styles.outline],
    };
    const sizes = {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    };
    return [base, variants[variant], sizes[size], style];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <Text style={[styles.title, styles[`title${variant.charAt(0).toUpperCase() + variant.slice(1)}`]]}>
            {title}
          </Text>
          {children}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#6366F1',
  },
  secondary: {
    backgroundColor: '#6B7280',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  small: {
    paddingHorizontal: 16,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    minHeight: 56,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titlePrimary: {
    color: 'white',
  },
  titleSecondary: {
    color: 'white',
  },
  titleOutline: {
    color: '#6366F1',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
  },
});

export default CommonButton;