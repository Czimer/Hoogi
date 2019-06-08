import React, { Component } from 'react';
import { AsyncStorage, Text, View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import DayAgenda from './DayAgenda';
import axios from 'axios';
import appConfig from '../../appConfig';
import { Manager } from '../../consts';

export default class CalendarView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayAgenda: [],
            dots: {},
            instances: [],
            showSpin: true,
            isManager: false
        };
    }

    handleDayPress = (day) => {
        if (this.state.instances != []) {
            let instancesCopy = JSON.stringify(this.state.instances);
            instancesCopy = JSON.parse(instancesCopy);
            
            if (this.state.isManager) {
                this.setState({dayAgenda: instancesCopy.filter(event => event.date === day.dateString)});
            } else {
                this.setState({dayAgenda: instancesCopy.map(child => {
                    child.events = child.events.filter(event => event.date === day.dateString);
                    return child;
                })});
            }

            console.log(this.state.dayAgenda);
        }
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData');
        const isManager = JSON.parse(loginData).user_type === Manager;

        if (isManager)
        {
            console.log('Manager');
            this.setState({ isManager });
            const managerId = JSON.parse(loginData).id;
            axios.post(`${appConfig.ServerApiUrl}/groups/getByManager`, {managerId:managerId}).then(response =>{
                console.log(response.data);
                let groups = response.data.map(group => group.id);
                axios.post(`${appConfig.ServerApiUrl}/event/getByGroups`, {groups:groups}).then(response =>{
                    console.log(response.data);
                    let modifyEvents = response.data.map(event => {
                        event = {
                            ...event, 
                            date: event.start_time.split("T")[0], 
                            start_time: event.start_time = event.start_time.split("T")[1].slice(0, 5), 
                            end_time: event.end_time = event.end_time.split("T")[1].slice(0, 5)
                        };
            
                        return event;
                    });

                    let eventInstance = modifyEvents.map(modEvent => {
                        return {
                            key: modEvent.group_name,
                            color: "red",
                            dates: [modEvent.date]
                        };
                    });

                    console.log(eventInstance);

                    const uniqueDates = [...new Set([].concat.apply([], modifyEvents.map(event => event.date)))];
                
                    console.log(uniqueDates);

                    const markedDatesArray = uniqueDates.map( x => ({ key: [x], value: { dots : eventInstance.filter(y => y.dates[0] == x)}}));
                    
                    console.log(markedDatesArray);

                    const markedDatesObject = Object.assign(...markedDatesArray.map(d => ({[d.key[0]]: d.value, selected: true, marked: true})));

                    console.log(markedDatesObject);

                    this.setState({
                        dots: markedDatesObject,
                        instances: modifyEvents,
                        showSpin: false
                    });

                }).catch(error => {console.log(error)})
            }).catch(error => {console.log(error)});
        } else {
            console.log('Parent');
            const parentId = JSON.parse(loginData).id;
            console.log(parentId);
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
                
                console.log(uniqueDates);

                const markedDatesArray = uniqueDates.map( x => ({ key: [x], value: { dots : children.filter( y => y.dates.includes(x))}}));
        
                const markedDatesObject = Object.assign(...markedDatesArray.map(d => ({[d.key[0]]: d.value, selected: true, marked: true}))); 

                console.log("marked: " + JSON.stringify(markedDatesObject));

                this.setState({
                    dots: markedDatesObject,
                    instances: instancesEvents,
                    showSpin: false
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }
  
    render() {
        const { dots, dayAgenda, showSpin, isManager} = this.state;
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
                <DayAgenda dayAgenda={dayAgenda} isManager={isManager}/>
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