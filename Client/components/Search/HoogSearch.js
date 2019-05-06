import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker } from 'react-native';
import { DataTable, FAB, Portal, Checkbox, TextInput, Button } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import {CheckBox} from 'react-native-elements'
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AnimatedLoader from "react-native-animated-loader";

export default class HoogSearch extends Component{
    constructor(props){
        super(props);
        this.state = {            
            tagSearchChkB:false,
            genderChkB:false,
            ageRangeChkB:false,
            locationChkB:false,
            tagSearch: "",
            gender:"נקבה",
            minAge:1,
            maxAge:20,
            location: "",
            // visible:false
        };    
    };
      
   
    onSearchButtonPress = () =>{
        let searchParams = {};

        this.state.tagSearchChkB ? searchParams.tags = this.state.tagSearch : '';
        this.state.genderChkB ? searchParams.gender = this.state.gender : '';
        this.state.ageRangeChkB ? searchParams.minAge = this.state.minAge : '';
        this.state.ageRangeChkB ? searchParams.maxAge = this.state.maxAge : '';
        this.state.locationChkB ? searchParams.location = this.state.location : '';

        console.log("in the button")
       // GOAL - navigate to another screen (search results) and do the request in there       
        axios.post('http://192.168.1.10:3000/api/hoogs/:params', searchParams).then(response =>{
            console.log(response.data); // TODO: remove it after it works
            this.props.navigation.navigate('SearchResults', {hoogsSearchResults:response.data});
        }).catch(error => {console.log(error)});     
        
    }

    
    render(){
        return(
            <>             
                <Text style={styles.head}>חיפוש חוגים</Text>
                    <CheckBox id="Tags" title="תגית" style={styles.checkbox} checked={this.state.tagSearchChkB} onPress={() => this.setState(prevState => ({tagSearchChkB : !prevState.tagSearchChkB}))}/>
                        <TextInput id="tagSearch" onChangeText={(text) => this.setState({tagSearch:text})}/>
                    <CheckBox id="location" title="מיקום" checked={this.state.locationChkB} onPress={() => this.setState(prevState => ({ locationChkB: !prevState.locationChkB}))}/>
                      {/*  beginning of google search */}
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
                            this.setState({location: lat + "," + lng});                               
                        }}
                        
                        getDefaultValue={() => ''}
                        
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyCJNmwQWr1gli1Se440KkI14nsFfgqQkAM', // TODO: save the key somewhere safer
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

                    {/* end of google search */}


                    <CheckBox id="Gender" title="מין" style={styles.checkbox} checked={this.state.genderChkB} onPress={() => this.setState(prevState => ({genderChkB: !prevState.genderChkB}))}/>
                        <Picker
                            selectedValue={this.state.gender}
                            style={{height: 50, width: 100}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({gender: itemValue})}>
                            <Picker.Item label="זכר" value="Male" />
                            <Picker.Item label="נקבה" value="Female" />
                        </Picker>
                    <CheckBox id="Ages" title="טווח גילאים" style={styles.checkbox} checked={this.state.ageRangeChkB} onPress={() => this.setState(prevState => ({ageRangeChkB: !prevState.ageRangeChkB}))}/>
                        <NumericInput initValue={this.state.maxAge} maxValue={99}
                            onChange={value => this.setState({maxAge:value})} />
                        <NumericInput initValue={this.state.minAge} minValue={1}
                            onChange={value => {this.setState({minAge:value});}} />                 

                    <Button mode='contained' onPress={this.onSearchButtonPress}>חפש</Button>
            
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 30, 
        paddingTop: 30, 
        backgroundColor: '#fff'
     },
    head: { 
        height: 40, 
        backgroundColor: '#fff' 
    },
    text: { textAlign: 'right' },
    Portal: {marginBottom:30},
    checkbox:{
        position: 'absolute', 
        right: 0
    },
    lottie: {
        width: 100,
        height: 100
      }
  });





