import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  touched?: boolean;
}

const InputField: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  touched,
  style,
  ...props
}) => {
  const hasError = !!error && touched;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
        <TextInput
          style={[styles.input, hasError && styles.inputError, style]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {hasError && <Text style={styles.errorText}>{error}</Text>}
        {!hasError && helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  labelError: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default InputField;