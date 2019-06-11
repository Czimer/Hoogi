import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker , Alert} from 'react-native';
import { DataTable, FAB, Portal, TextInput, Button, Card } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
// import {CheckBox} from 'react-native-elements'
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AnimatedLoader from "react-native-animated-loader";
import appConfig from '../../appConfig'
import CheckBox from 'react-native-check-box'

export default class HoogSearch extends Component{
    static navigationOptions = {
        title: 'חיפוש חוגים'
    }
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
        };    
    };
      
   
    onSearchButtonPress = () =>{
        let searchParams = {};

        this.state.tagSearchChkB ? searchParams.tags = this.state.tagSearch : '';
        this.state.genderChkB ? searchParams.gender = this.state.gender : '';
        this.state.ageRangeChkB ? searchParams.minAge = this.state.minAge : '';
        this.state.ageRangeChkB ? searchParams.maxAge = this.state.maxAge : '';
        this.state.locationChkB ? searchParams.location = this.state.location : '';

        axios.post(appConfig.ServerApiUrl + '/hoogs/:params', searchParams).then(response =>{
            this.props.navigation.navigate('SearchResults', {hoogsSearchResults:response.data});
        }).catch(error => {console.log(error)});     
        
    }

    
    render(){
        return(
            <ScrollView>
            <Card>  
                <Card.Content>
                        <View style={styles.searchInput}>
                            <CheckBox id="Tags" leftText={"תגית"} style={{flex: 1, padding: 10}} onClick={() => this.setState(prevState => ({tagSearchChkB : !prevState.tagSearchChkB}))} isChecked={this.state.tagSearchChkB}/>
                            <TextInput id="tagSearch" label="רשום תגיות חיפוש" onChangeText={(text) => this.setState({tagSearch:text})}/>
                        </View>
                        <View style={styles.searchInput}>

                            <CheckBox id="location" leftText={"מיקום"} style={{flex: 1, padding: 10}} onClick={() => this.setState(prevState => ({locationChkB : !prevState.locationChkB}))} isChecked={this.state.locationChkB}/>
                            {/*  beginning of google search */}
                            <GooglePlacesAutocomplete
                                placeholder='חפש מיקום'
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
                                    key: appConfig.locationApiKey, 
                                    language: 'iw', // language of the results                           
                                }}
                                
                                styles={{
                                    textInputContainer: {
                                    width: '100%',
                                    },
                                    description: {
                                    fontWeight: 'bold',
                                    paddingRight: 60,
                                    overflow: 'hidden'
                                    },
                                    predefinedPlacesDescription: {
                                    color: '#1faadb',
                                    paddingRight: 60,
                                    overflow: 'hidden'
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
                        </View>
                        <View style={styles.searchInput}>
                            <CheckBox id="Gender" leftText={"מין"} style={{flex: 1, padding: 10}} onClick={() => this.setState(prevState => ({genderChkB : !prevState.genderChkB}))} isChecked={this.state.genderChkB}/>
                            <Picker
                                selectedValue={this.state.gender}
                                style={{height: 50, width: 100}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({gender: itemValue})}>
                                <Picker.Item label="זכר" value="Male" />
                                <Picker.Item label="נקבה" value="Female" />
                            </Picker>
                        </View>
                        <View style={styles.searchInput}>

                            <CheckBox id="Ages" leftText={"טווח גילאים"} style={{flex: 1, padding: 10}} onClick={() => this.setState(prevState => ({ageRangeChkB : !prevState.ageRangeChkB}))} isChecked={this.state.ageRangeChkB}/>
                            <NumericInput initValue={this.state.maxAge} maxValue={99}
                                onChange={value => this.setState({maxAge:value})} />
                            <NumericInput initValue={this.state.minAge} minValue={1}
                                onChange={value => {this.setState({minAge:value});}} 
                                />  
                        </View>
                </Card.Content>
                <Card.Actions>
                    <Button mode='contained' onPress={this.onSearchButtonPress}>חפש</Button>
                </Card.Actions> 
            </Card>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        paddingTop: 30, 
        backgroundColor: '#fff',
        flexDirection: 'row'
     },
    head: { 
        height: 40, 
        backgroundColor: '#fff' 
    },
    text: { textAlign: 'right' },
    Portal: {marginBottom:30},
    checkbox:{
        position: 'absolute', 
        right: 0,
    },
    lottie: {
        width: 100,
        height: 100
      },
    searchInput: {
        borderRadius: 3,borderColor: '#9ED3F7', borderWidth: 1, backgroundColor: '#EEF8FF', margin: 8, marginBottom: 0, padding: 10,
    },
  });





