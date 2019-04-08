import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker } from 'react-native';
import { DataTable, FAB, Portal, Checkbox, TextInput, Button } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import {CheckBox} from 'react-native-elements'
import axios from 'axios';


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
            location: ""
        };    
    };
      
   
    onSearchButtonPress = () =>{
        let searchParams = {};

        this.state.tagSearchChkB ? searchParams.tags = this.state.tagSearch : '';
        this.state.genderChkB ? searchParams.gender = this.state.gender : '';
        this.state.ageRangeChkB ? searchParams.minAge = this.state.minAge : '';
        this.state.ageRangeChkB ? searchParams.maxAge = this.state.maxAge : '';
        this.state.locationChkB ? searchParams.location = this.state.location : '';

        console.log('dana banana before axios.get ');
        console.log(this.state);
        console.log(searchParams);
        // GOAL - navigate to another screen (search results) and do the request in there
        // if(searchParams === {}){
        //     axios.get('localhost:3000/api/hoogs/').then(response =>{
        //         console.log(response.data);
        //     }).catch(error => {console.log(error)});
        // }
        // else{
        //     axios.get('/hoogs', {params:searchParams}).then(response =>{
        //         // do something with the response
        //     }).catch(error => {    
        //         console.log(error)
        //     });
        // } 

        this.props.navigation.navigate('SearchResults');
    }

    render(){
        return(
                <View style={styles.container}>
                    <Text style={styles.head}>חיפוש חוגים</Text>
                    <CheckBox id="Tags" title="תגית" style={styles.checkbox} checked={this.state.tagSearchChkB} onPress={() => this.setState(prevState => ({tagSearchChkB : !prevState.tagSearchChkB}))}/>
                        <TextInput id="tagSearch"   onChangeText={(text) => this.setState({tagSearch:text})}/>
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
                    <CheckBox id="location" title="מיקום" checked={this.state.locationChkB} onPress={() => this.setState(prevState => ({ locationChkB: !prevState.locationChkB}))}/>
                    <Button onPress={this.onSearchButtonPress}>חפש</Button>
                   
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#fff' },
    text: { textAlign: 'right' },
    Portal: {marginBottom:30},
    checkbox:{position: 'absolute', right: 0}
  });





