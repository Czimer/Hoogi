import React, { Component } from 'react';
import { AsyncStorage, Text, View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import DayAgenda from './DayAgenda';
import axios from 'axios';
import appConfig from '../../appConfig';

export default class CalendarView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            dayAgenda: [],
            dots: {},
            instances: [],
            showSpin: true
        };
    }

    handleDayPress = (day) => {
        if (this.state.instances != []) {
            let instancesCopy = JSON.stringify(this.state.instances);
            instancesCopy = JSON.parse(instancesCopy);
            this.setState({dayAgenda: instancesCopy.map(child => {
                child.events = child.events.filter(event => event.date === day.dateString);
                return child;
            })});
        }
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData');
        const parentId = JSON.parse(loginData).id;
        axios.post(`${appConfig.ServerApiUrl}/parentsAndChilds/child/events`, {parentId: parentId}).then(response => {
            console.log(response.data);
            const instancesEvents = response.data.map(child => {
                child.events = JSON.parse(child.events).map(event => {
                    event = {
                        ...event, 
                        date: event.start_time.split("T")[0], 
                        start_time: event.start_time = event.start_time.split("T")[1].slice(0, 5), 
                        end_time: event.end_time = event.end_time.split("T")[1].slice(0, 5)
                    };
        
                    return event;
                });
        
                return child;
            });

            const children = instancesEvents.map(child => {
                return {
                    key: child.name,
                    color: child.color,
                    dates: child.events.map(event => event.date)
                };
            });
    
            const uniqueDates = [...new Set([].concat.apply([], children.map(child => child.dates)))];
            
            const markedDatesArray = uniqueDates.map( x => ({ key: [x], value: { dots : children.filter( y => y.dates.includes(x))}}));
            
            const markedDatesObject = Object.assign(...markedDatesArray.map(d => ({[d.key[0]]: d.value, selected: true, marked: true}))); 

            this.setState({
                dots: markedDatesObject,
                instances: instancesEvents,
                showSpin: false
            });
        }).catch(error => {
            console.log(error);
        });
    }
  
    render() {
        const { dots, dayAgenda, showSpin} = this.state;
        return (
            showSpin ? <ActivityIndicator animating={true} size="large" /> : 
            <View>
                <CalendarList style={styles.calendar}
                    horizontal={true}
                    pagingEnabled={true}
                    hideArrows={true}
                    markedDates={dots}
                    markingType={'multi-dot'}
                    onDayPress={this.handleDayPress}
                    onMonthChange={(month) => console.log('month changed', month)}/>
                <DayAgenda dayAgenda={dayAgenda}/>
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