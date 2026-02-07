// src/components/CommonButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';

interface CommonButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  style,
  children,
  disabled,
  onPress,
  ...props
}) => {
  const getButtonStyle = () => {
    const base = [
      styles.button,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
    ];

    switch (variant) {
      case 'primary':
        base.push(styles.primary);
        break;
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'danger':
        base.push(styles.danger);
        break;
    }

    switch (size) {
      case 'sm':
        base.push(styles.small);
        break;
      case 'lg':
        base.push(styles.large);
        break;
    }

    return [base, style];
  };

  const getTextStyle = () => {
    const base = [styles.text];

    switch (size) {
      case 'sm':
        base.push(styles.textSmall);
        break;
      case 'lg':
        base.push(styles.textLarge);
        break;
    }

    return base;
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (!loading && !disabled && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <Text style={[styles.text, styles.loadingText]}>Loading...</Text>
      ) : (
        <>
          <Text style={getTextStyle()}>{title}</Text>
          {children}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flexDirection: 'row',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  primary: {
    backgroundColor: '#6366F1', // Indigo-500
  },
  secondary: {
    backgroundColor: '#64748B', // Slate-500
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  danger: {
    backgroundColor: '#EF4444', // Red-500
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    minHeight: 56,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  loadingText: {
    fontStyle: 'italic',
  },
});