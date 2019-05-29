import React, { Component } from 'react';
import axios from 'axios';
import GenericList from '../../genericComponents/genericList/GenericList'
import { FAB, Card, TextInput, Text, Button, HelperText} from 'react-native-paper';
import { View, StyleSheet, ScrollView, AsyncStorage, Alert} from 'react-native';
import appConfig from '../../appConfig'
import Modal from 'react-native-modal';
import { Manager } from '../../consts';



export default class ContactsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:['ת"ז', 'גיל', 'מין', 'מס טלפון החניך', 'מספר טלפון ההורה','שם החניך','שם ההורה'],            
            actionsModalVisible: false,
            addNewContactModalVisible:false,
            contactChildId: 0,
            addIcon:true,
            IdInputNumber: 0
        };    
    };

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager        
        const groupId = this.props.navigation.getParam('groupId');
        this.setState({groupId, managerMode:isManager})
        this.getAllContactsOfSpecificGroup();
    }

    getAllContactsOfSpecificGroup = () =>{
        axios.post(appConfig.ServerApiUrl + '/parentsAndChilds/:params', {groupId:this.state.groupId}).then(response =>{
            this.setState({tableData:response.data});
        }).catch(error => {console.log(error)});
    }

    openAddNewContactWindow = () =>{
        this.setState({addNewContactModalVisible:true})
    }

    addNewContact = (childId) =>{
        const groupId = this.props.navigation.getParam('groupId');
        /// TODO: validate the id
        if(childId !== 0){
            // send to server
            axios.post(appConfig.ServerApiUrl + '/groups/registerNewParticipantToGroup/:params', 
            {groupId:groupId, childId:childId}).then(response =>{
                Alert.alert('החניך התווסף בהצלחה!')
                this.closeModal();
                this.getAllContactsOfSpecificGroup();
            }).catch(error => {
                console.log(error)
                this.closeModal();
                Alert.alert('הייתה בעיה בהוספת החניך')
            });            
        }
    }   
    
    

    removeParticipant = (contId) =>{
        const groupId = this.props.navigation.getParam('groupId');
        if(contId !== 0){        

            Alert.alert(
                'שים לב!',
                'האם אתה בטוח? שאתה רוצה למחוק את משתתף ' + contId + '?',
                [
                    {text: 'כן', onPress: () => remove()},
                    {text: 'לא', onPress: () => console.log('')}
                ]
            )

            remove = () =>{
                axios.post(appConfig.ServerApiUrl + '/groups/removeChildFromGroupById/:params', 
                {groupId:groupId, childId:contId}).then(response =>{
                    Alert.alert('החניך הוסר מהקבוצה בהצלחה!')
                    this.closeModal();
                    this.getAllContactsOfSpecificGroup();
                }).catch(error => {
                    console.log(error)
                    this.closeModal();
                    Alert.alert('הייתה בעיה בהסרת החניך מהרשימה ')
                });
            }           
        }
    }

    handleLongPress = (event, row) =>{
        this.setState({actionsModalVisible: true, contactChildId: row.child_id})
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false,
                addNewContactModalVisible: false
            });
    }

    // checkIdFieldValidation = () =>{
    //     const {IdInputNumber} = this.state;
    //     const childIdError
    //     if (IdInputNumber.trim() === '' || childIdInputNumberId.trim().length < 2) {           
    //         childIdError = 'תעודת זהות לא תקינה'            
    //     }
    //     this.setState({childIdError});
    // }

    render(){
        const {tableData, tableHead, actionsModalVisible, contactChildId, addNewContactModalVisible, managerMode} = this.state;
        return(
            <View>            
               {
                   (tableData !== undefined) &&  
                   <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>                   
                    <Modal key='actionsModal'          
                        isVisible={actionsModalVisible && managerMode}>
                            <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>   
                                <Card.Content>
                                    <Button mode="contained" onPress={() => this.removeParticipant(contactChildId)}>
                                        <Text> הסר חניך מספר {contactChildId}</Text>
                                    </Button>  
                                </Card.Content>
                                <Card.Actions>                                   
                                    <Button mode="outlined" onPress={this.closeModal}>
                                        <Text>בטל</Text>
                                    </Button>         
                                </Card.Actions>                                                   
                            </Card>
                    </Modal>

                    <Modal isVisible={addNewContactModalVisible && managerMode}>
                         <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>  
                            <Card.Content>
                                <TextInput id="newChildId" dataDetectorTypes="phoneNumber" placeholder="הכנס תעודת זהות של החניך" onChangeText={(text) => this.setState({IdInputNumber:text})}/>
                                {!!this.state.childIdError && <HelperText type="error">{this.state.childIdError}</HelperText>}
                            </Card.Content>
                            <Card.Actions>                               
                                <Button mode="contained" onPress={() => this.addNewContact(this.state.IdInputNumber)}>
                                    <Text>הוסף חניך חדש</Text>
                                </Button>
                                <Button mode="outlined" onPress={this.closeModal}>
                                        <Text>בטל</Text>
                                </Button>  
                            </Card.Actions>                                
                        </Card>
                    </Modal>
                    {
                        managerMode && 
                        <FAB style={styles.fab} icon="add" onPress={this.openAddNewContactWindow}/>
                    }                    
                   </GenericList>    
                }        
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })