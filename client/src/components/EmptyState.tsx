import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  title: string;
  description?: string;
  buttonTitle?: string;
  onPress?: () => void;
  image?: string; // Lottie or image source
  style?: any;
}

const EmptyState: React.FC<Props> = ({
  title,
  description,
  buttonTitle,
  onPress,
  image,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Image/Illustration Area */}
      <View style={styles.imageContainer}>
        {image ? (
          <View style={styles.placeholderImage} />
        ) : (
          <View style={[styles.icon, styles.noDataIcon]} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* Action Button */}
      {buttonTitle && onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minHeight: height * 0.6,
  },
  imageContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderImage: {
    width: 160,
    height: 160,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataIcon: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;