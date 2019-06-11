import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet,AsyncStorage } from "react-native";
import DatePicker from '../../genericComponents/Pickers/DatePicker';
import DateTimePicker from "react-native-modal-datetime-picker"
import ReactChipsInput from 'react-native-chips';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import appConfig from '../../appConfig';
import axios from 'axios';

export default class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: {
                id: this.props.navigation.state.params.id,
                name: this.props.navigation.state.params.group_name,
                date: this.props.navigation.state.params.date,
                start_time: this.props.navigation.state.params.start_time,
                end_time: this.props.navigation.state.params.end_time,
                location: this.props.navigation.state.params.location,
                equipment: this.props.navigation.state.params.equipment,
                description: this.props.navigation.state.params.description
            },
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false
        }
    }    

    showStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: true });
      };
     
      hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
      };
     
      handleStartTimePicked = date => {
        console.log("A date has been picked: ", date);
        date.setHours(date.getHours() + 3);
        this.setState(prevState => ({event: { ...prevState.event, start_time: date.toISOString().split('T')[1].slice(0, 5)}}));
        this.hideStartTimePicker();
      };

      showEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: true });
      };
     
      hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
      };
     
      handleEndTimePicked = date => {
        console.log("A date has been picked: ", date);
        date.setHours(date.getHours() + 3);
        this.setState(prevState => ({event: { ...prevState.event, end_time: date.toISOString().split('T')[1].slice(0, 5)}}));
        this.hideEndTimePicker();
      };
    
    updateEvent() {
        console.log(this.state.event);
        axios.post(`${appConfig.ServerApiUrl}/event/update`, {event:this.state.event}).then(response => {
            console.log(response.data);
        }).catch();
    }
    

    async componentDidMount(){
        
    }

    render() {
        const { event } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{event.name}</Text>
                <DatePicker style={styles.line} title={'בחר תאריך'} date={event.date} 
                            onChange={date => this.setState(prevState => ({ event: { ...prevState.event, date: date } }))}></DatePicker>
                <View style={styles.line}>
                    <Text style={styles.hoursText}>שעת התחלה: {event.start_time}</Text>
                    <Button style={styles.hoursText} icon="edit" onPress={() => this.showStartTimePicker()}></Button>
                    <DateTimePicker
                        isVisible={this.state.isStartTimePickerVisible}
                        onConfirm={this.handleStartTimePicked}
                        onCancel={this.hideStartTimePicker}
                        mode="time"
                    />
                </View>
                <View style={styles.line}>
                    <Text style={styles.hoursText}>שעת סיום: {event.end_time}</Text>
                    <Button style={styles.hoursText} icon="edit" onPress={() => this.showEndTimePicker()}></Button>
                    <DateTimePicker
                        isVisible={this.state.isEndTimePickerVisible}
                        onConfirm={this.handleEndTimePicked}
                        onCancel={this.hideEndTimePicker}
                        mode="time"
                    />
                </View>
                <View style={styles.line}>
                    <ReactChipsInput label="הוסף ציוד" initialChips={event.equipment} 
                                    onChangeChips={(chips) => console.log(chips)} alertRequired={true} 
                                    chipStyle={{ borderColor: '#3498db', backgroundColor: '#bbbbbb' }}/>
                </View>
                <GooglePlacesAutocomplete 
                        placeholder='Search'
                        minLength={3} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'none'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true                            ;
                            const lat = details.geometry.location.lat;
                            const lng = details.geometry.location.lng;
                            this.setState(prevState => ({event:{...prevState.event, location: lat + "," + lng, address:data.description}}));
                        }}
                        
                        getDefaultValue={() => event.location}
                        
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: appConfig.locationApiKey,
                            language: 'iw', // language of the results                           
                        }}
                        
                        styles={{
                            marginTop: 5,
                            textInputContainer: {
                                width: '100%'
                            },
                            description: {
                                fontWeight: 'bold'
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            }
                        }}
                        
                        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                        currentLocationLabel="מיקום נוכחי"
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                    
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            types: 'food'
                        }}
                    
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        // predefinedPlaces={[homePlace, workPlace]}
                    
                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                        // renderRightButton={() => <Text>Custom text after the input</Text>}
                    />
                <Button style={styles.editBut} onPress={() => this.updateEvent()}>
                    <Text style={styles.editTxt}>שמור שינויים</Text>
                </Button>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:15,
        backgroundColor: '#fff',
        direction: 'rtl'
    },
    image: {
        alignItems: 'center'
    },
    title: {
        marginTop: 5,
        fontSize: 22,
        marginLeft: 5
    },
    line: {
        fontSize: 16,
        marginTop: 5,
        textAlign: 'right',
        flexDirection: 'row',
    },
    hoursText: {
        textAlign: 'right',
        justifyContent: 'flex-start',
        fontSize: 14,
        marginTop: 5,
        alignItems: "center"
    },
    hoursEdit: {
        textAlign: 'right',
        justifyContent: 'flex-start',
        fontSize: 14,
        marginTop: 5,
        alignItems: "center"
    },
    description: {
        fontSize: 14,
        marginTop: 10,
        height: 100,
        flexDirection: 'row',
        width: 350,
        justifyContent: 'flex-start',
        marginLeft: 20
    },
    editBut: {
        backgroundColor: '#fae782',
        marginTop: 10
    },
    editTxt: {
        color: '#517a8b'
    }
});