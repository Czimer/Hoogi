import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker } from 'react-native';
import { DataTable, FAB, Portal, Checkbox, TextInput, Button } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import {CheckBox} from 'react-native-elements'
import { NativeRouter, Route, Link } from "react-router-native";
import GroupsList from "../Lists/GroupsList"
import { StackNavigator } from "react-navigation";

// export const Routes = StackNavigator({   
//     GroupsList: { screen: GroupsList },
//   });

//   const AppNavigator = createStackNavigator({
//     GroupsList: {
//       screen: GroupsList
//     }
//   });

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
            ages:{
                min:0,
                max:20
            }
        };    
    };

      
   
    onSearchButtonPress = (event) =>{
        console.log(this.props) 
        console.log(this.props.navigation) 
        this.props.navigation.navigate('SearchResults');
    }

    render(){
        return(
                <View style={styles.container}>
                    <Text style={styles.head}>חיפוש חוגים</Text>
                    <CheckBox id="Tags" title="תגית" style={styles.checkbox} checked={this.state.tagSearchChkB} onPress={() => this.setState({tagSearchChkB : !this.state.tagSearchChkB})}/>
                        <TextInput id="tagSearch"   onChangeText={(text) => this.setState({tagSearch:text})}/>
                    <CheckBox id="Gender" title="מין" style={styles.checkbox} checked={this.state.genderChkB} onPress={() => this.setState({genderChkB: !this.state.genderChkB})}/>
                        <Picker
                            selectedValue={this.state.gender}
                            style={{height: 50, width: 100}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({gender: itemValue})
                            }>
                            <Picker.Item label="זכר" value="Male" />
                            <Picker.Item label="נקבה" value="Female" />
                        </Picker>
                    <CheckBox id="Ages" title="טווח גילאים" style={styles.checkbox} checked={this.state.ageRangeChkB} onPress={() => this.setState({ageRangeChkB: !this.state.ageRangeChkB})}/>
                        <NumericInput initValue={this.state.ages.max} maxValue={99}
                            onChange={value => this.setState({ages:{max:value, min: this.state.ages.min}})} />
                        <NumericInput initValue={this.state.ages.min} minValue={1}
                            onChange={value => {this.setState({ages:{min:value, max: this.state.ages.max}});}} />
                    <CheckBox id="location" title="מיקום"
                        checked={this.state.locationChkB}
                        onPress={() => { this.setState({ locationChkB: !this.state.locationChkB});}}
                    />
                    <Button onPress={this.onSearchButtonPress}>חפש</Button>
                   
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {marginTop:30, flex: 1, padding: 30, paddingTop: 30, backgroundColor: '#f3f' },
    head: {marginTop:30,  height: 40, backgroundColor: '#f1f33f' },
    text: { textAlign: 'right' },
    Portal: {marginBottom:30},
    checkbox:{position: 'absolute', right: 0}
  });





