import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from './AppContainer';
// import { I18nManager } from "react-native";

// I18nManager.allowRTL(false)
// I18nManager.forceRTL(false)

export default class App extends React.Component {

  render() {
    return (
      <PaperProvider>
        <AppContainer></AppContainer>
      </PaperProvider>
    );
  }
}