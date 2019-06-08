import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet,AsyncStorage } from "react-native";
import DatePicker from '../../genericComponents/Pickers/DatePicker';
import TimePicker from '../../genericComponents/Pickers/TimePicker';
import ReactChipsInput from 'react-native-chips';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


export default class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: {
                name: this.props.navigation.state.params.group_name,
                date: this.props.navigation.state.params.date,
                start_hour: this.props.navigation.state.params.start_hour,
                end_hour: this.props.navigation.state.params.end_hour,
                address: this.props.navigation.state.params.address,
                equipment: this.props.navigation.state.params.equipment
            }
        }
    }        
    

    async componentDidMount(){
        
    }

    render() {
        const { event } = this.state;
        return (
            <View>
                <Text>{event.name}</Text>
                <DatePicker title={'בחר תאריך'} date={event.date} 
                            isLimited onChange={date => this.setState(prevState => ({ event: { ...prevState.event, date } }))}></DatePicker>
                <TimePicker title={'בחר שעת התחלה'} time={event.start_hour} 
                            onChange={start_hour => this.setState(prevState => ({ event: { ...prevState.event, start_hour } }))}></TimePicker>
                <TimePicker title={'בחר שעת סיום'} time={event.end_hour}
                            onChange={end_hour => this.setState(prevState => ({ event: { ...prevState.event, end_hour } }))}></TimePicker>
                <GooglePlacesAutocomplete
                        placeholder='חפש כתובת'
                        minLength={3} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true                            ;
                            const lat = details.geometry.location.lat;
                            const lng = details.geometry.location.lng;
                            this.setState({location: lat + "," + lng});                               
                        }}
                        
                        getDefaultValue={() => ''}
                        
                        query={{
                            
                            key: 'AIzaSyDe2cx9NLqtDipMKZ1J2EeioMAn2W9L_20', // TODO: save the key somewhere safer
                            language: 'iw',
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
                    
                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    />
                    <ReactChipsInput label="הכנס ציוד" initialChips={event.equipment} 
                                     onChangeChips={(chips) => console.log(chips)} alertRequired={true} 
                                     chipStyle={{ borderColor: 'blue', backgroundColor: 'grey' }}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});