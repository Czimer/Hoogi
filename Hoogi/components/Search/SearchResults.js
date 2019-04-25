import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios'


export default class SearchResults extends Component{
    constructor(props){
        super(props);
        this.state = {
            // todo - we should get the results from the server
            hoogsSearchResults: [
                {
                    name: 'כדורגל',
                    id: '12345',
                    ageRange: '15-17',
                    loaction: '',
                    guidName: 'נועם פועם',
                    guidPhone: '0544444444',
                    gender: 'בנות',
                    tags: ['כדור', 'מגרש']
                },
                {
                    name: 'כדורגל',
                    id: '12346',
                    ageRange: '15-17',
                    loaction: '',
                    guidName: 'נועם פועם',
                    guidPhone: '0544444444',
                    gender: 'בנים',
                    tags: ['כדור', 'מגרש']
                },
                {
                    name: 'כדורת',
                    id: '23444',
                    ageRange: '12-14',
                    loaction: '',
                    guidName: 'שולי שלשולי',
                    guidPhone: '0533333333',
                    gender: 'בנות',
                    tags: ['כדור', 'מסלול']
                },
                {
                    name: 'כדורסל',
                    id: '4353',
                    ageRange: '13-15',
                    loaction: '',
                    guidName: 'לילי גלילי',
                    guidPhone: '0522222222',
                    gender: 'בנים',
                    tags: ['כדור', 'מגרש']
                }
            ]
        };
    }

    onRegisterPress = (hoogId) =>{
        // todo - register to the hoog
    }
    render(){
        return(
            <View>
                <Text>תוצאות חיפוש</Text>
                <View>
                    <FlatList
                        data={this.props.hoogsSearchResults}
                        renderItem={({item}) =>
                        <View key={item.id}>
                            <Text>קוד חוג</Text>
                            <Text>{item.id}</Text>
                            <Text>שם החוג</Text>
                            <Text>{item.name}</Text>
                            <Text>שם המדריך</Text>
                            <Text>{item.guidName}</Text>
                            <Text>מספר טלפון של המדריך</Text>
                            <Text>{item.guidPhone}</Text>
                            <Text>מיקום</Text>
                            <Text>{item.loaction}</Text>
                            <Text>מין</Text>
                            <Text>{item.gender}</Text>
                            <Text>טווח הגילאים</Text>
                            <Text>{item.ageRange}</Text>
                            <Text>תגיות רלוונטיות</Text>
                            <Text>{item.tags.toString()}</Text>
                            <Button onPress={this.onRegisterPress(item.id)}> הרשמה </Button>
                        </View>
                        }
                    />
                </View>
            </View>
        );
    }
}