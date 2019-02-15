import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper'

export default class App extends React.Component {
  render() {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
