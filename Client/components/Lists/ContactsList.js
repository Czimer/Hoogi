import React, { Component } from 'react';
import axios from 'axios';
import GenericList from '../../genericComponents/genericList/GenericList'
import { FAB, Portal, TextInput, Text, Button} from 'react-native-paper';
import { View, StyleSheet, ScrollView, Modal, Picker} from 'react-native';



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

    componentDidMount = () =>{ // TODO: change to the wanted group id
        const { groupId } = props.navigation.getParam('groupId');
        axios.post('http://192.168.1.10:3000/api/parentsAndChilds/:params', {groupId:groupId}).then(response =>{
            this.setState({tableData:response.data});
        }).catch(error => {console.log(error)});
    }

    openAddNewContactWindow = () =>{
        console.log(" entered openAddNewContactWindow")
        this.setState({addNewContactModalVisible:true})
    }

    addNewContact = (childId) =>{
        console.log(" entered addNewContact")
        /// TODO: validate the id
        if(childId !== 0){
            // send to server
            axios.post('http://192.168.1.10:3000/api/groups/registerNewParticipantToGroup/:params', 
            {groupId:this.props.groupId, childId:childId}).then(response =>{
                console.log(response.data);
                // TODO: alert a message relevant to the response
                this.setState({addNewContactModalVisible:false})
            }).catch(error => {
                console.log(error)
                this.setState({addNewContactModalVisible:false})
            });            
        }
    }    

    removeParticipant = (contId) =>{
        console.log("entered removeParticipant")
        if(contId !== 0){        
            // popup - are you sure? TODO: needed?
            // else - send to the server
            axios.post('http://192.168.1.10:3000/api/groups/removeChildFromGroupById/:params', 
            {groupId:this.props.groupId, childId:childId}).then(response =>{
                console.log(response.data);
                // TODO: alert a message relevant to the response
                this.setState({actionsModalVisible:false})
            }).catch(error => {
                console.log(error)
                this.setState({actionsModalVisible:false})
            });
        }
    }

    handleLongPress = (event) =>{
        // TODO: handle the data from event property - add to state? contactChildId
        console.log("entered handle long press")
        console.log(this.state.actionsModalVisible)
        // insert a check if the user is manager - only manager is able to insert, edit or delete
        this.setState({actionsModalVisible: true})
        console.log(this.state.actionsModalVisible)
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, contactChildId, addNewContactModalVisible} = this.state;
        return(
            <View>            
               {
                   (tableData !== undefined) &&  
                   <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
                    {/* add an if statement - show only if the user is a manager role */}
                    {/* {
                            role === "manager" &&
                    } */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={actionsModalVisible}>
                            <View style={{marginTop: 22}}>                               
                                <Button onPress={this.removeParticipant(contactChildId)}>
                                    <Text> הסר חניך מספר {contactChildId}</Text>
                                </Button>                            
                            </View>
                    </Modal>

                    {/* <Modal animationType="slide"
                        transparent={true}
                        visible={addNewContactModalVisible}>
                        <TextInput id="newChildId" dataDetectorTypes="phoneNumber" onChangeText={(text) => this.setState({IdInputNumber:text})}></TextInput>
                        <Button onPress={this.addNewContact(this.state.IdInputNumber)}>
                            <Text>הוסף חניך חדש</Text>
                        </Button>
                    </Modal>

                    <Portal>
                        <FAB
                            style={styles.fab}
                            small
                            icon="add"
                            onPress={this.openAddNewContactWindow}
                        />
                    </Portal>       */}
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