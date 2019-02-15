import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';

const FirstChild = {key:'FirstChild', color: 'red', dates: ['2019-01-27', '2019-01-28']};
const SecondChild = {key:'SecondChild', color: 'blue', dates: ['2019-01-27']};
const ThirdChild = {key:'ThirdChild', color: 'green', dates: ['2019-01-27', '2019-01-28', '2019-01-29']};

const children = [FirstChild, SecondChild, ThirdChild];

const uniqueDates = [...new Set([].concat.apply([], children.map(child => child.dates)))];

const markedDatesArray = uniqueDates.map( x => ({ key: [x], value: { dots : children.filter( y => y.dates.includes(x))}}));
const markedDatesObject = Object.assign(...markedDatesArray.map(d => ({[d.key[0]]: d.value})));


export default class CalendarAgenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }

  render() {
      return (
        <Agenda 
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={'2017-05-16'}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markedDates={{
             '2017-05-08': {dotColor: 'red', marked: true},
             '2017-05-09': {dotColor: 'blue', marked: true}
            }}
        />
      );
    }

    
  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
  
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.itemView, {height: item.height}]}><Text style={styles.itemText}>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text style={styles.itemText}>לא קיימים חוגים</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

// Hebrew Days & Monthes
LocaleConfig.locales['isr'] = {
  monthNames: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
  monthNamesShort: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
  dayNames: ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],
  dayNamesShort: [`א'`,`ב'`,`ג'`,`ד'`,`ה'`,`ו'`,`ש'`]
};

LocaleConfig.defaultLocale = 'isr';

const styles = StyleSheet.create({
  itemView: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  itemText: {
    textAlign: 'left'
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});