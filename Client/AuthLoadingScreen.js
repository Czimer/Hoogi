import React from 'react';
import { AsyncStorage, View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('loginData');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Image style={{ height: 350, width: 350 }} source={require('./assets/logo.jpg')} />
        <ActivityIndicator animating={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})