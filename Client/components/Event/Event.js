import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet,AsyncStorage } from "react-native";
import DatePicker from '../../genericComponents/Pickers/DatePicker';
import TimePicker from 'react-native-simple-time-picker';
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
            }
        }
    }    
    
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
            <View>
                <Text>{event.name}</Text>
                <DatePicker title={'בחר תאריך'} date={event.date} 
                            onChange={date => this.setState(prevState => ({ event: { ...prevState.event, date: date } }))}></DatePicker>
                <TimePicker
                    selectedHours={parseInt(event.start_time.split(':')[0])}
                    //initial Hourse value
                    selectedMinutes={parseInt(event.start_time.split(':')[1])}
                    //initial Minutes value
                    onChange={(hours, minutes) => this.setState(prevState => ({event: 
                    {
                        ...prevState.event, 
                        start_time: `${hours}:${minutes}` 
                    }}))}
                />
                <TimePicker
                    selectedHours={parseInt(event.end_time.split(':')[0])}
                    //initial Hourse value
                    selectedMinutes={parseInt(event.end_time.split(':')[1])}
                    //initial Minutes value
                    onChange={(hours, minutes) => this.setState(prevState => ({event: 
                    {
                        ...prevState.event, 
                        end_time: `${hours}:${minutes}` 
                    }}))}
                />
                <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={3} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true                            ;
                            const lat = details.geometry.location.lat;
                            const lng = details.geometry.location.lng;
                            this.setState(prevState => ({event:{...prevState.event, location: lat + "," + lng, address:data.description}}));
                        }}
                        
                        getDefaultValue={() => ''}
                        
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: appConfig.locationApiKey,
                            language: 'iw', // language of the results                           
                        }}
                        
                        styles={{
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
                    <ReactChipsInput label="הכנס ציוד" initialChips={event.equipment} 
                                     onChangeChips={(chips) => console.log(chips)} alertRequired={true} 
                                     chipStyle={{ borderColor: 'blue', backgroundColor: 'grey' }}/>

                <Button onPress={() => this.updateEvent()}>עדכן</Button>
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    
});