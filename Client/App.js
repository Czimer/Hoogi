import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from './AppContainer';

export default class App extends React.Component {

  render() {
    return (
      <PaperProvider>
        <AppContainer></AppContainer>
      </PaperProvider>
    );
  }
}