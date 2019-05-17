import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'
import axios from 'axios';
import { View, StyleSheet, Picker, Portal} from 'react-native';
import { Text, Button, FAB} from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import Modal from 'react-native-modal';




export default class GroupsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:['מקסימום משתתפים', 'שעה', 'יום', 'מין', 'גיל מקסימלי', 'גיל מינימלי','שם חוג','מזהה קבוצה'],         
            actionsModalVisible: false, 
            groupId:0,
            addNewGroupModalVisible:false,
            allHoogsArray: [],
            newGroupData:{}
        };
        
         axios.get('http://192.168.1.10:3000/api/hoogs/getAllHoogsNames').then(response =>{
            this.setState({allHoogsArray:response.data});
        }).catch(error => console.log(error));
    };

    componentDidMount = () =>{ 
        //TODO: change the managerId according to the current signed manager
        axios.post('http://192.168.1.10:3000/api/groups/:params', {managerId:893032893}).then(response =>{
            console.log(response.data);
            this.setState({tableData:response.data})
        }).catch(error => {console.log(error)});

        // axios.get('http://192.168.1.10:3000/api/hoogs/getAllHoogsNames').then(response =>{
        //     this.setState({allHoogsArray:response.data});
        // }).catch(error => console.log(error));
    }

    goToContactList = (groupId) =>{
        if(groupId !== 0){
            this.setState({actionsModalVisible:false});
            this.props.navigation.navigate('ContactsList', {groupId:groupId});
        }
        
    }

    removeGroup = (groupId) =>{
        axios.delete('http://192.168.1.10:3000/api/groups/deleteGroupById', {groupId:groupId}).then(response =>{
            console.log(response.data);
            // TODO: delete succeeded
            this.setState({actionsModalVisible:false});
        }).catch(error => {
            console.log(error);
        });
    }

    openAddNewGroupWindow = () =>{
        console.log(" entered openAddNewContactWindow")
        this.setState({addNewGroupModalVisible:true})
    }


    addNewGroup = () =>{
        const newGroupData = this.state.newGroupData;

        axios.delete('http://192.168.1.10:3000/api/groups/addNewGroup', {groupData:newGroupData}).then(response =>{
            console.log(response.data);
            // TODO: insert succeeded
            this.setState({addNewGroupModalVisible:false});
        }).catch(error => {
            console.log(error);
            this.setState({addNewGroupModalVisible:true});
        });

    }

    handleLongPress = (event, row) =>{
        // TODO: handle the data from event property - add to state? contactChildId
       
        // insert a check if the user is manager - only manager is able to insert, edit or delete
        this.setState(
            {
                actionsModalVisible: true,
                groupId: row.id
            });
        console.log(this.state.actionsModalVisible)
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false
            });
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, groupId, addNewGroupModalVisible} = this.state;
        console.log("actionsModalVisible " + actionsModalVisible)
        return(

            <View>
            {

            (tableData !== undefined) &&  
            <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
            <Modal isVisible={this.state.actionsModalVisible}>
                    <View style={{marginTop: 22, backgroundColor:'#FFF'}}>                               
                        <Button onPress={() => this.removeGroup(groupId)}>
                            <Text>מחק קבוצה {groupId}</Text>
                        </Button>
                        <Button onPress={() => this.goToContactList(groupId)}>
                            <Text>עבור לרשימת המשתתפים בקבוצה</Text>
                        </Button>
                        <Button onPress={this.closeModal}>
                            <Text>X</Text>
                        </Button>                                                 
                    </View>
                </Modal>  
                
                        {/* <Modal animationType="slide"
                            transparent={true}
                            visible={addNewGroupModalVisible}>
                            <Text>קבוצה חדשה</Text>
                            <Text>סוג חוג</Text>
                            <Picker                           
                                style={{height: 50, width: 100}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState(prevState => ({newGroupData: {...prevState.newGroupData, hoogId:itemValue}}))}>
                                {
                                    this.state.allHoogsArray.map(currHoog => {
                                        return (<Picker.item lable={currHoog.name} value={currHoog.id}></Picker.item>)
                                    })
                                }
                            </Picker>
                            <Text>גיל מינימלי</Text>
                            <NumericInput minValue={1}
                                onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, minAge:value}}));}} />
                            <Text>גיל מקסימלי</Text>
                            <NumericInput maxValue={99}
                                onChange={value => this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxAge:value}}))} />
                            <Text>מין</Text>
                            <Picker
                                selectedValue={this.state.gender}
                                style={{height: 50, width: 100}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState(prevState => ({newGroupData: {...prevState.newGroupData, gender:itemValue}}))}>
                                <Picker.Item label="זכר" value="Male" />
                                <Picker.Item label="נקבה" value="Female" />
                            </Picker>
                            <Text>יום</Text>
                            <Picker
                                selectedValue={this.state.gender}
                                style={{height: 50, width: 100}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState(prevState => ({newGroupData: {...prevState.newGroupData, day:itemValue}}))}>
                                <Picker.Item label="ראשון" value="ראשון" />
                                <Picker.Item label="שני" value="שני" />
                                <Picker.Item label="שלישי" value="שלישי" />
                                <Picker.Item label="רביעי" value="רביעי" />
                                <Picker.Item label="חמישי" value="חמישי" />
                                <Picker.Item label="שישי" value="שישי" />
                                <Picker.Item label="שבת" value="שבת" />
                            </Picker>
                            <Text>שעה</Text>
                            {timepicker}
                            <NumericInput minValue={5} maxValue={20}
                                onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxParticipants:value}}));}} />                        
                            <Button onPress={this.addNewGroup}>
                                <Text>הוסף קבוצה חדשה</Text>
                            </Button>
                        </Modal>                    */}
                        {/* <Portal>
                            <FAB
                                style={styles.fab}
                                small
                                icon="add"
                                onPress={this.openAddNewGroupWindow}
                            />
                        </Portal>       */}
            </GenericList>
            
            }
            </View>

        //   <View>
            //   <Modal                            
            //     isVisible={this.state.actionsModalVisible}>
            //         <View style={{marginTop: 22}}>                               
            //             <Button onPress={() => this.removeGroup(groupId)}>
            //                 <Text>מחק קבוצה {groupId}</Text>
            //             </Button>
            //             <Button onPress={() => this.goToContactList(groupId)}>
            //                 <Text>עבור לרשימת המשתתפים בקבוצה</Text>
            //             </Button>                            
            //         </View>
            //     </Modal> 
        //   </View>
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