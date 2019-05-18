import React, { Component } from 'react';
import axios from 'axios';
import GenericList from '../../genericComponents/genericList/GenericList'
import { FAB, Portal, TextInput, Text, Button} from 'react-native-paper';
import { View, StyleSheet, ScrollView, Picker, Alert} from 'react-native';
import appConfig from '../../appConfig'
import Modal from 'react-native-modal';



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

    componentDidMount = () =>{
        
        const groupId = this.props.navigation.getParam('groupId');
        axios.post(appConfig.ServerApiUrl + '/parentsAndChilds/:params', {groupId:groupId}).then(response =>{
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
                this.setState({addNewContactModalVisible:false})
            }).catch(error => {
                console.log(error)
                this.setState({addNewContactModalVisible:false})
                Alert.alert('הייתה בעיה בהוספת החניך')
            });            
        }
    }   
    
    

    removeParticipant = (contId) =>{
        const groupId = this.props.navigation.getParam('groupId');
        if(contId !== 0){        

            alert.alert(
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
                    this.setState({actionsModalVisible:false})
                }).catch(error => {
                    console.log(error)
                    this.setState({actionsModalVisible:false})
                    Alert.alert('הייתה בעיה בהסרת החניך מהרשימה ')
                });
            }           
        }
    }

    handleLongPress = (event) =>{
        // TODO: handle the data from event property - add to state? contactChildId
        // insert a check if the user is manager - only manager is able to insert, edit or delete
        this.setState({actionsModalVisible: true})
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false
            });
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, contactChildId, addNewContactModalVisible} = this.state;
        return(
            <View>            
               {
                   (tableData !== undefined) &&  
                   <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
                    {/* TODO: add an if statement - show only if the user is a manager role */}
                    {/* {
                            role === "manager" &&
                    } */}
                    <Modal key='actionsModal'          
                        isVisible={actionsModalVisible}>
                            <View style={{marginTop: 22, backgroundColor:'#FFF'}}>                               
                                <Button onPress={this.removeParticipant(contactChildId)}>
                                    <Text> הסר חניך מספר {contactChildId}</Text>
                                </Button>  
                                <Button onPress={this.closeModal}>
                                    <Text>X</Text>
                                </Button>                                
                            </View>
                    </Modal>

                    <Modal
                        isVisible={addNewContactModalVisible}>
                         <View style={{marginTop: 22, backgroundColor:'#FFF'}}>                                  
                            <Button onPress={() => this.addNewContact(this.state.IdInputNumber)}>
                                <Text>הוסף חניך חדש</Text>
                            </Button>
                            <TextInput id="newChildId" dataDetectorTypes="phoneNumber" placeholder="הכנס תעודת זהות של החניך" onChangeText={(text) => this.setState({IdInputNumber:text})}></TextInput>
                            <Button onPress={this.closeModal}>
                                    <Text>X</Text>
                            </Button>  
                        </View>
                    </Modal>

                    {/* <Portal> */}
                        <FAB
                            style={styles.fab}
                            small
                            icon="add"
                            onPress={this.openAddNewContactWindow}
                        />
                    {/* </Portal>       */}
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