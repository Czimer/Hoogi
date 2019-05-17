import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import DayAgenda from './DayAgenda';
import axios from 'axios';
import appConfig from '../../appConfig';

let instances1 = [ { name: 'דנה',
color: 'red',
events: '[{"id":"1","group_id":"3","group_name":"כדורסל רעננה בנות 12-14","start_time":"2019-05-05T16:00:00.000Z","end_time":"2019-05-05T17:30:00.000Z","location":"אחוזה 31, רעננה","equipment":["מגבת","בקבוק מים","כדור"],"description":null},{"id":"3","group_id":"3","group_name":"כדורסל רעננה בנות 12-14","start_time":"2019-05-12T16:00:00.000Z","end_time":"2019-05-12T17:30:00.000Z","location":"אחוזה 31, רעננה","equipment":["מגבת","בקבוק מים","כדור"],"description":null}]' },
{ name: 'אלעד',
color: 'blue',
events: '[{"id":"2","group_id":"5","group_name":"טאקוואנדו רעננה בנים 8-11","start_time":"2019-05-05T13:00:00.000Z","end_time":"2019-05-05T15:00:00.000Z","location":"החרושת 26, אור יהודה","equipment":null,"description":null}]' } ];

const FirstChild = {key:'FirstChild', color: 'red', dates: ['2019-05-11', '2019-05-12']};
const SecondChild = {key:'SecondChild', color: 'blue', dates: ['2019-05-11']};
const ThirdChild = {key:'ThirdChild', color: 'green', dates: ['2019-05-11', '2019-05-12', '2019-05-14']};

const children1 = [FirstChild, SecondChild, ThirdChild];

export default class CalendarView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {},
            dayAgenda: [],
            dots: {},
            instances: []
        };

        console.log("ctor");
    }

    handleDayPress = (day) => {
        console.log("daypress");
        if (this.state.instances != []) {
            let instancesCopy = JSON.stringify(this.state.instances);
            instancesCopy = JSON.parse(instancesCopy);
            this.setState({dayAgenda: instancesCopy.map(child => {
                child.events = child.events.filter(event => event.date === day.dateString);
                return child;
            })});
        }
    }

    componentDidMount() {
        console.log("did");
        axios.post(`${appConfig.ServerApiUrl}/parentsAndChilds/child/events`, {parentId: '123456789'}).then(response => {
            console.log("did1");
            const instancesEvents = response.map(child => {
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
                instances: instancesEvents
            });

            console.log("did2");
        }).catch(error => {
            console.log(error);
        });
    }
  
    render() {
        if (this.state.dots != {})
        {
            return (
                <View>
                    <CalendarList style={styles.calendar}
                        horizontal={true}
                        pagingEnabled={true}
                        hideArrows={true}
                        markedDates={this.state.dots}
                        markingType={'multi-dot'}
                        onDayPress={this.handleDayPress}
                        onMonthChange={(month) => console.log('month changed', month)}/>
                    <DayAgenda dayAgenda={this.state.dayAgenda}/>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
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