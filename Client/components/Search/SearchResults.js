import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView, Alert, AsyncStorage, Picker, StyleSheet} from 'react-native';
import { Button, Card} from 'react-native-paper';
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
        if(selectedChild == undefined || selectedChild == ""){
            Alert.alert('שים לב!', 'לא בחרת ילד להרשמה')
        }
        else{
            axios.post(appConfig.ServerApiUrl + '/groups/registerNewParticipantToGroup/:params', 
            {groupId:currentWantedGroupId, childId:selectedChild}).then(response =>{               
                Alert.alert('החניך התווסף בהצלחה!')
                this.setState({childPickerVisible:false});                          
            }).catch(error => {
                console.log(error)
                this.setState({childPickerVisible:false});
                Alert.alert('לא ניתן להוסיף את החניך לקבוצה')
            }); 
        }        
    }

    render(){
        const {childPickerVisible, childrenArray} = this.state;
        return(
            <View style={styles.view}>
                <Text style={styles.title}>תוצאות חיפוש</Text>
                <ScrollView>
                    <FlatList
                        data={this.state.hoogsSearchResults}
                        renderItem={({item}) =>
                        <Card key={item.id}>                            
                            <Text>שם החוג: {item.name}</Text>
                            <Text>שם המדריך: {item.guid_name}</Text>
                            <Text>מספר טלפון של המדריך: {item.guid_phone}</Text>
                            <Text>מיקום: {item.loc}</Text>
                            <Text>מין: {item.gender == 'female' ? 'נקבה' : 'זכר'}</Text>                           
                            <Text>טווח הגילאים: {item.age_range}</Text>
                            <Text>תגיות רלוונטיות: {item.tags.toString()}</Text>
                            <Text>יום: {item.group_times.day}</Text>
                            <Text>שעה: {item.group_times.time}</Text>
                            <Button mode='contained' onPress={() => this.onRegisterPress(item.group_id)}> הרשמה </Button>
                            <Text></Text>
                        </Card>
                        }
                    />
                    <Modal isVisible={childPickerVisible}>
                        <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>
                        <Card.Content>
                                <Text>בחר ילד/ה</Text>
                                <Picker style={{height: 50, width: 100}}
                                            selectedValue={this.state.selectedChild}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({selectedChild:itemValue})}>
                                                <Picker.Item key={0} label="" value={0}/>
                                                {
                                                    childrenArray.map((currChild,i) =>
                                                    {
                                                        return <Picker.Item key={currChild.child_id} label={currChild.first_name} value={currChild.child_id}/>}
                                                )}
                                </Picker>
                            </Card.Content>
                            <Card.Actions>
                                <Button mode="contained" onPress={() => this.registerSelectedChild()}>
                                    <Text>אישור</Text>
                                </Button>
                                <Button mode="outlined" onPress={() => this.setState({childPickerVisible:false})}>
                                    <Text>בטל</Text>
                                </Button>
                            </Card.Actions>
                        </Card>
                    </Modal> 
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    view:{
        paddingBottom: '5%'
    }
  })