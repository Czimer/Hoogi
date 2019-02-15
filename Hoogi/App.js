import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider, BottomNavigation } from 'react-native-paper'
import MessageFeed from './components/MessageFeed/MessageFeed'
import Calendar from './components/Calendar/Calendar'

const CalendarRoute = () => <Calendar/>;
const FeedRoute = () => <MessageFeed/>;

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
        <BottomNavigation
          navigationState={this.state}
          onIndexChange={this.handleIndexChange}
          renderScene={this.renderScene}
        />
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
