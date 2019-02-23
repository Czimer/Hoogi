import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import DayAgenda from './DayAgenda';

const instances = [{
    childName: 'נועה',
    color: 'red',
    date: '2019-02-11',
    name: `הפועל כפר סבא 'תמר'`,
    start_hour: '17:30',
    end_hour: '19:00',
    location: 'אולם היובל',
    equipment: ['כדור', 'מגבת', 'בקבוק מים 1.5 ליטר', 'חולצה בהירה', 'חולצה כהה']
}, {
    childName: 'יותם',
    color: 'blue',
    date: '2019-02-11',
    name: `מטפסים - הנבחרת הצעירה`,
    start_hour: '15:30',
    end_hour: '18:00',
    location: 'iclimb כפר סבא',
    equipment: ['נעלי טיפוס', 'שק מגנזיום']
}, {
    childName: 'נעמה',
    color: 'green',
    date: '2019-02-11',
    name: `התעמלות קרקע - גילאים 12-15`,
    start_hour: '16:30',
    end_hour: '18:00',
    location: `מרכז ספורט 'אלון'`,
    equipment: ['בגדי התעמלות']
}, {
    childName: 'נועה',
    color: 'red',
    date: '2019-02-12',
    name: `הפועל כפר סבא 'תמר'`,
    start_hour: '18:30',
    end_hour: '20:00',
    location: 'בית ספר אופירה נבון',
    equipment: ['כדור', 'מגבת', 'בקבוק מים 1.5 ליטר', 'חולצה בהירה', 'חולצה כהה']
}, {
    childName: 'נעמה',
    color: 'green',
    date: '2019-02-12',
    name: `התעמלות קרקע - גילאים 12-15`,
    start_hour: '16:30',
    end_hour: '18:00',
    location: `תיכון כצנלסון`,
    equipment: ['בגדי התעמלות']
}, {
    childName: 'נעמה',
    color: 'green',
    date: '2019-02-14',
    name: `התעמלות קרקע - גילאים 12-15`,
    start_hour: '16:30',
    end_hour: '18:00',
    location: `מרכז ספורט 'אלון'`,
    equipment: ['בגדי התעמלות']
}];

const FirstChild = {key:'FirstChild', color: 'red', dates: ['2019-02-11', '2019-02-12']};
const SecondChild = {key:'SecondChild', color: 'blue', dates: ['2019-02-11']};
const ThirdChild = {key:'ThirdChild', color: 'green', dates: ['2019-02-11', '2019-02-12', '2019-02-14']};

const children = [FirstChild, SecondChild, ThirdChild];

const uniqueDates = [...new Set([].concat.apply([], children.map(child => child.dates)))];

const markedDatesArray = uniqueDates.map( x => ({ key: [x], value: { dots : children.filter( y => y.dates.includes(x))}}));
const markedDatesObject = Object.assign(...markedDatesArray.map(d => ({[d.key[0]]: d.value, selected: true, marked: true})));
console.log(markedDatesObject);

export default class CalendarView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: {},
        dayAgenda: []
      };
    }

    handleDayPress = (day) => {
        this.setState({dayAgenda: instances.filter(instance => instance.date === day.dateString)});
    }
  
    render() {
        return (
            <View>
                <CalendarList style={styles.calendar}
                    horizontal={true}
                    pagingEnabled={true}
                    hideArrows={true}
                    markedDates={markedDatesObject}
                    markingType={'multi-dot'}
                    onDayPress={this.handleDayPress}/>
                <DayAgenda dayAgenda={this.state.dayAgenda}/>
            </View>
        );
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

  const styles = {
      calendar: {
          marginTop: 30,
          height: 310
      }
  }