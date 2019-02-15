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

export default class CalendarView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: {}
      };
    }
  
    render() {
        return (
            <Calendar
            markedDates={markedDatesObject}
            markingType={'multi-dot'}/>
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