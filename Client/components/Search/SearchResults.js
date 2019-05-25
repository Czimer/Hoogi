import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView, Alert, AsyncStorage, Picker} from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import axios from 'axios';
import appConfig from '../../appConfig'


export default class SearchResults extends Component{
    constructor(props){
        super(props);
        this.state = {           
            hoogsSearchResults: this.props.navigation.state.params['hoogsSearchResults'],            
            childrenArray:[],
            childPickerVisible:false
        };
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData');
        const parentId = JSON.parse(loginData).id;        
        this.setState({parentId});
        axios.post(appConfig.ServerApiUrl + '/parentsAndChilds/childrenOfParentId/:params', {parentId:this.state.parentId}).then(response =>{
            if(response.data != "" && response.data instanceof Array){
                this.setState({childrenArray:response.data});
            }
        }).catch(error => {console.log(error)});

    }

    onRegisterPress = (groupId) =>{
        this.setState({currentWantedGroupId:groupId, childPickerVisible:true});          
    }

    registerSelectedChild = () =>{
        const {selectedChild, currentWantedGroupId} = this.state;
        axios.post(appConfig.ServerApiUrl + '/groups/registerNewParticipantToGroup/:params', 
            {groupId:currentWantedGroupId, childId:selectedChild}).then(response =>{
                Alert.alert('החניך התווסף בהצלחה!')
                this.setState({childPickerVisible:false});
            }).catch(error => {
                console.log(error)
                this.setState({childPickerVisible:false});
                Alert.alert('הייתה בעיה בהוספת החניך')
            });         
        
    }

    render(){
        const {childPickerVisible, childrenArray} = this.state;
        return(
            <View>
                <Text>תוצאות חיפוש</Text>
                <ScrollView>
                    <FlatList
                        data={this.state.hoogsSearchResults}
                        renderItem={({item}) =>
                        <View key={item.id}>                            
                            <Text>שם החוג</Text>
                            <Text>{item.name}</Text>
                            <Text>שם המדריך</Text>
                            <Text>{item.guid_name}</Text>
                            <Text>מספר טלפון של המדריך</Text>
                            <Text>{item.guid_phone}</Text>
                            <Text>מיקום</Text>
                            <Text>{item.loc}</Text>
                            <Text>מין</Text>
                            {
                                item.gender == 'female' &&
                                <Text>נקבה</Text> 
                            }
                            {
                                item.gender == 'male' &&
                                <Text>זכר</Text> 
                            }
                            <Text>טווח הגילאים</Text>
                            <Text>{item.age_range}</Text>
                            <Text>תגיות רלוונטיות</Text>
                            <Text>{item.tags.toString()}</Text>
                            <Text>יום</Text>
                            <Text>{item.group_times.day}</Text>
                            <Text>שעה</Text>
                            <Text>{item.group_times.time}</Text>
                            <Button onPress={() => this.onRegisterPress(item.group_id)}> הרשמה </Button>
                        </View>
                        }
                    />
                    <Modal isVisible={childPickerVisible}>
                        <View style={{marginTop: 22, backgroundColor:'#FFF'}}>
                            <Text>בחר ילד/ה</Text>
                            <Picker style={{height: 50, width: 100}}
                                        selectedValue={this.state.selectedChild}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({selectedChild:itemValue})}>
                                            {
                                                childrenArray.map((currChild,i) =>
                                                {
                                                    return <Picker.Item key={currChild.child_id} label={currChild.first_name} value={currChild.child_id}/>}
                                            )}
                            </Picker>
                            <Button onPress={() => this.registerSelectedChild()}>
                                <Text>אישור</Text>
                            </Button>
                            <Button onPress={() => this.setState({childPickerVisible:false})}>
                                <Text>X</Text>
                            </Button>
                        </View>
                    </Modal> 
                </ScrollView>
            </View>
        );
    }
}