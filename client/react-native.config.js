// Alix App - React Native Config
// Enables: AdMob assets, Agora resources, custom fonts/images, Hermes optimizations

module.exports = {
  dependencies: {
    // AdMob: Enable Google Mobile Ads iOS/Android assets
    'react-native-google-mobile-ads': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-google-mobile-ads/ios',
          podspecPath: '../node_modules/react-native-google-mobile-ads/ReactNativeGoogleMobileAds.podspec',
        },
        android: {
          sourceDir: '../node_modules/react-native-google-mobile-ads/android',
          packageImportPath: 'import io.invertase.firebase.ads.RNGoogleMobileAdsPackage;',
        },
      },
    },

    // Agora UIKit/Video SDK: Custom resources
    'agora-rn-uikit': {
      platforms: {
        android: {
          sourceDir: '../node_modules/agora-rn-uikit/android',
          packageImportPath: 'import io.agora.rnkit.RNUIKitPackage;',
        },
      },
    },

    // Expo modules if using (location/camera)
    'expo-location': {
      platforms: {
        android: {
          packageImportPath: 'import expo.modules.location.LocationPackage;',
        },
      },
    },
    'expo-camera': {
      platforms: {
        android: {
          packageImportPath: 'import expo.modules.camera.CameraPackage;',
        },
      },
    },
  },

  // Custom assets: fonts, images for posts/profiles
  assets: [
    './assets/fonts/',      // Snapchat-style: Roboto, custom bold
    './assets/images/',     // profile avatars, icons, splash
    './assets/videos/',     // Agora test videos
  ],

  // Hermes optimizations (faster JS bundle)
  hermes: {
    enabled: true,
    // Bytecode bundling for production
  },

  project: {
    ios: {},    // Auto-linking iOS
    android: {}, // Auto-linking Android
  },
};