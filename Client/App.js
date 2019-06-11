import React from 'react';
import { DefaultTheme,Provider as PaperProvider } from 'react-native-paper';
import AppContainer from './AppContainer';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#517a8b'
  },
  // fonts: {
  //   regular: 'Roboto',
  //   medium: 'Roboto',
  //   light: 'Roboto Light',
  //   thin: 'Roboto Thin',
  // }
};

// import { I18nManager } from "react-native";

// I18nManager.allowRTL(false)
// I18nManager.forceRTL(false)

export default class App extends React.Component {

  render() {
    return (
      <PaperProvider theme={theme}>
        <AppContainer></AppContainer>
      </PaperProvider>
    );
  }
}