import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#000"
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>🎉 Alix APK Success!</Text>
          </View>
          <Text style={styles.subtitle}>
            React Native + TypeScript + GitHub Actions
          </Text>
          <Text style={styles.info}>Real-time collaboration ready</Text>
          <View style={styles.separator} />
          <Text style={styles.next}>Next: Synce features ➡️</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  info: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#333',
    alignSelf: 'center',
    marginVertical: 20,
  },
  next: {
    fontSize: 18,
    color: '#00ff88',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default App;
