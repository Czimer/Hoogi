import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider, BottomNavigation } from 'react-native-paper'
import Feed from './components/Feed/Feed'
import Calendar from './components/Calendar/Calendar'
import SignIn from './components/SignIn/SignIn';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppContainer from './AppContainer';
const CalendarRoute = () => <Calendar/>;
const FeedRoute = () => <Feed/>;

export default class App extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'feed', title: 'Feed', icon: 'message' },
      { key: 'calendar', title: 'Calendar', icon: 'date-range' }
      
    ]
  }

  handleIndexChange = index => this.setState({ index });

  renderScene = BottomNavigation.SceneMap({
    calendar: CalendarRoute,
    feed: FeedRoute
  });

  render() {
    return (
      <PaperProvider>
        <AppContainer></AppContainer>
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
