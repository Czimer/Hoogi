import React, { Component } from 'react';
import axios from 'axios';
import GenericList from '../../genericComponents/genericList/GenericList'
import { FAB, Card, TextInput, Text, Button, HelperText} from 'react-native-paper';
import { View, StyleSheet, ScrollView, AsyncStorage, Alert, Picker} from 'react-native';
import appConfig from '../../appConfig'
import Modal from 'react-native-modal';
import { Manager } from '../../consts';



export default class ContactsList extends Component{
    static navigationOptions = {
        title: 'רשימת משתתפים'
    }
    constructor(props){
        super(props);
        this.state = {
            // tableHead:['ת"ז', 'גיל', 'מין', 'מס טלפון החניך', 'מספר טלפון ההורה','שם החניך','שם ההורה'],            
            tableHead:['שם ההורה', 'שם החניך', 'מספר טלפון ההורה', 'מס טלפון החניך', 'מין','גיל','ת"ז'],            
            actionsModalVisible: false,
            addNewContactModalVisible:false,
            moveParticipantModalVisible:false,
            contactChildId: 0,
            addIcon:true,
            IdInputNumber: 0,
            transferMode:false
        };    
    };

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager        
        const groupId = this.props.navigation.getParam('groupId');
        this.setState({groupId, managerMode:isManager})
        this.getAllContactsOfSpecificGroup();
        this.getAllOtherGroupsOfHoog();
    }

    getAllContactsOfSpecificGroup = () =>{
        axios.post(appConfig.ServerApiUrl + '/parentsAndChilds/:params', {groupId:this.state.groupId}).then(response =>{
            this.setState({tableData:response.data});
        }).catch(error => {console.log(error)});
    }

    getAllOtherGroupsOfHoog = () =>{
        axios.post(appConfig.ServerApiUrl + '/groups/getAllGroupsOfHoogKind/:params', {groupId:this.state.groupId}).then(response =>{
            this.setState({otherGroupsOfHoogKind:response.data});
        }).catch(error => {console.log(error)});
    }

    openAddNewContactWindow = () =>{
        this.setState({addNewContactModalVisible:true})
    }

    addNewContact = (childId, p_groupId) =>{
        const groupId = p_groupId? p_groupId : this.props.navigation.getParam('groupId');
        if(childId !== 0){
            // send to server
            axios.post(appConfig.ServerApiUrl + '/groups/registerNewParticipantToGroup/:params', 
            {groupId:groupId, childId:childId}).then(response =>{
                if(this.state.transferMode){
                    this.remove(p_groupId, childId)
                }
                else{
                    Alert.alert('החניך התווסף בהצלחה!')
                }
                this.closeModal();
                this.getAllContactsOfSpecificGroup();
            }).catch(error => {
                console.log(error)
                this.closeModal();
                this.state.transferMode ? Alert.alert('הייתה בעיה בהעברת החניך לקבוצה אחרת') : Alert.alert('הייתה בעיה בהוספת החניך');
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
                    {text: 'כן', onPress: () => remove(groupId, contId)},
                    {text: 'לא', onPress: () => console.log('')}
                ]
            )           
        }
    }

    remove = (groupId, contId) =>{
        axios.post(appConfig.ServerApiUrl + '/groups/removeChildFromGroupById/:params', 
        {groupId:groupId, childId:contId}).then(response =>{
            if(!this.state.transferMode){
                Alert.alert('החניך הוסר מהקבוצה בהצלחה!');
                this.setState({moveParticipantModalVisible :false, transferMode:false})
            }            
            this.closeModal();
            this.getAllContactsOfSpecificGroup();
        }).catch(error => {
            console.log(error)
            this.closeModal();
            this.state.transferMode ? Alert.alert('הייתה בעיה בהעברת החניך לקבוצה אחרת') : Alert.alert('הייתה בעיה בהסרת החניך מהרשימה ');            
        });
    }        

    handleLongPress = (event, row) =>{
        this.setState({actionsModalVisible: true, contactChildId: row.child_id})
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false,
                addNewContactModalVisible: false,
                moveParticipantModalVisible: false
            });
    }

    transferChildToChosenGroup = () =>{
        const {chosenTransferGroup, contactChildId} = this.state;
        this.addNewContact(contactChildId, chosenTransferGroup);
    }
    openTransferChildModal = (contactChildId) =>{
        this.setState({moveParticipantModalVisible :true, transferMode:true, contactChildId})
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
        const {tableData, tableHead, actionsModalVisible, contactChildId, otherGroupsOfHoogKind,
             addNewContactModalVisible, managerMode, moveParticipantModalVisible} = this.state;
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
                                    <Button mode="contained" onPress={() => this.openTransferChildModal(contactChildId)}>
                                        <Text> העבר את החניך לקבוצה אחרת</Text>
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
                                <Button mode="outlined" onPress={() => this.addNewContact(this.state.IdInputNumber)}>
                                    <Text>הוסף חניך חדש</Text>
                                </Button>
                                <Button mode="contained" onPress={this.closeModal}>
                                        <Text>בטל</Text>
                                </Button>  
                            </Card.Actions>                                
                        </Card>
                    </Modal>
                    
                    <Modal isVisible={moveParticipantModalVisible && managerMode}>
                        <Card>
                            <Card.Content>
                                <Picker        
                                    selectedValue={this.state.chosenTransferGroup}                                                  
                                    style={{height: 50, width: '90%'}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({chosenTransferGroup: itemValue})}>
                                        {
                                            this.state.otherGroupsOfHoogKind && this.state.otherGroupsOfHoogKind.map((currGroup,i) =>
                                            {
                                                return <Picker.Item key={currGroup.id} label={currGroup.name} value={currGroup.id}/>}
                                        )}
                                </Picker>
                            </Card.Content>
                            <Card.Actions>
                                <Button mode='contained' onPress={this.transferChildToChosenGroup}>
                                    <Text>העבר את החניך לקבוצה {this.state.chosenTransferGroup}</Text>
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
      margin: 40,
      right: 250,
      bottom: 0,
    },
  })