import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'
import axios from 'axios';
import { View, StyleSheet, Picker, Portal, Alert} from 'react-native';
import { Text, Button, FAB} from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import Modal from 'react-native-modal';
import appConfig from '../../appConfig'
import TimePicker from 'react-native-simple-time-picker';




export default class GroupsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:['מקסימום משתתפים', 'שעה', 'יום', 'מין', 'גיל מקסימלי', 'גיל מינימלי','שם חוג','מזהה קבוצה'],         
            actionsModalVisible: false, 
            groupId:0,
            addNewGroupModalVisible:false,
            allHoogsArray: [],
            newGroupData:{
                selectedMinutes: '00',
                selectedHours: '12',
                minAge:1,
                maxAge:20
            }        

        };
        
         axios.post(appConfig.ServerApiUrl + '/hoogs/getAllHoogsNames', {managerId:315315315}).then(response =>{
            this.setState({allHoogsArray:response.data});
        }).catch(error => console.log(error));
    };

    componentDidMount = () =>{ 
        //TODO: change the managerId according to the current signed manager
        axios.post(appConfig.ServerApiUrl + '/groups/:params', {managerId:315315315}).then(response =>{
            console.log(response.data);
            this.setState({tableData:response.data})
        }).catch(error => {console.log(error)});
    }

    goToContactList = (groupId) =>{
        if(groupId !== 0){
            this.setState({actionsModalVisible:false});
            this.props.navigation.navigate('ContactsList', {groupId:groupId});
        }        
    }

    removeGroup = (groupId) =>{

        Alert.alert(
            'שים לב!',
            'האם אתה בטוח שתרצה למחוק את קבוצה '  + groupId + '?',
            [
                {
                    text:'כן',
                    onPress: () => this.deleteGroupFinal(groupId)
                },
                {
                    text:'לא'

                }
            ]
        )

        // function deleteGroupFinal(){
        //     axios.delete(appConfig.ServerApiUrl + '/groups/deleteGroupById', {groupId:groupId}).then(response =>{
        //         Alert.alert('הקבוצה נמחקה בהצלחה!')
        //         this.setState({actionsModalVisible:false});
        //     }).catch(error => {
        //         console.log(error);
        //         Alert.alert('הייתה בעיה במחיקת הקבוצה')            
        //     });
        // }
       
    }

    deleteGroupFinal =(groupId) => {
        axios.delete(appConfig.ServerApiUrl + '/groups/deleteGroupById', {groupId:groupId}).then(response =>{
            Alert.alert('הקבוצה נמחקה בהצלחה!')
            this.setState({actionsModalVisible:false});
        }).catch(error => {
            console.log(error);
            Alert.alert('הייתה בעיה במחיקת הקבוצה')            
        });
    }

    openAddNewGroupWindow = () =>{
        this.setState({addNewGroupModalVisible:true})
    }


    addNewGroup = () =>{
        const newGroupData = this.state.newGroupData;

        axios.post(appConfig.ServerApiUrl + '/groups/addNewGroup/:params', {groupData:newGroupData}).then(response =>{
            console.log(response.data);
            Alert.alert('הקבוצה התווספה בהצלחה!')
            this.setState({addNewGroupModalVisible:false});
        }).catch(error => {
            console.log(error);
            this.setState({addNewGroupModalVisible:true});
            Alert.alert('הייתה בעיה בהוספת הקבוצה')
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
                actionsModalVisible: false,
                addNewGroupModalVisible: false
            });
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, groupId, addNewGroupModalVisible, selectedHours, selectedMinutes} = this.state;
        return(
            <View>
            {

            (tableData !== undefined) &&  
            <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
            <Modal isVisible={actionsModalVisible}>
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
  
                        <Modal isVisible={addNewGroupModalVisible}>
                            <View style={{marginTop: 22, backgroundColor:'#FFF'}}>
                                <Text>קבוצה חדשה</Text>
                                <Text>סוג חוג</Text>                   
                                <Picker
                                    selectedValue={this.state.newGroupData.hoogId}                    
                                    style={{height: 50, width: 100}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState(prevState => ({newGroupData: {...prevState.newGroupData, hoogId:itemValue}}))}>
                                        {
                                            this.state.allHoogsArray.map((currHoog,i) =>
                                            {
                                                return <Picker.Item key={currHoog.id} label={currHoog.name} value={currHoog.id}/>}
                                        )}
                                 </Picker>
                             <Text>גיל מינימלי</Text>
                                <NumericInput initValue={this.state.newGroupData.minAge}
                                    onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, minAge:value}}));}} />
                                <Text>גיל מקסימלי</Text>
                                <NumericInput maxValue={99} initValue={this.state.newGroupData.maxAge}
                                    onChange={value => this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxAge:value}}))} />
                                
                                <Text>מין</Text>
                                <Picker 
                                    selectedValue={this.state.newGroupData.gender}
                                    style={{height: 50, width: 100}}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState(prevState => ({newGroupData: {...prevState.newGroupData, gender:itemValue}}))}>
                                    <Picker.Item label="זכר" value="Male" />
                                    <Picker.Item label="נקבה" value="Female" />
                                </Picker>
                                <Text>יום</Text>
                                <Picker key="days"
                                    selectedValue={this.state.newGroupData.day}
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
                                <TimePicker
                                    selectedHours={selectedHours}
                                    //initial Hourse value
                                    selectedMinutes={selectedMinutes}
                                    //initial Minutes value
                                    onChange={(hours, minutes) => this.setState(prevState => ({newGroupData: 
                                    {
                                        ...prevState.newGroupData, 
                                        selectedHours: hours, 
                                        selectedMinutes: minutes 
                                    }}))}
                                />  
                                <Text>מספר משתתפים מקסימלי</Text>
                                <NumericInput minValue={5} maxValue={20}
                                    onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxParticipants:value}}));}} />                        
                                <Button onPress={this.addNewGroup}>
                                    <Text>הוסף קבוצה חדשה</Text>
                                </Button> 
                                <Button onPress={this.closeModal}>
                                    <Text>בטל</Text>
                                </Button>
                            </View>
                        </Modal> 
                               
                        {/* <Portal> */}
                            <FAB
                                 style={styles.fab}
                                small
                                icon="add"
                                onPress={this.openAddNewGroupWindow}
                            />
                        {/* </Portal>        */}
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
      right: 0,
      bottom: 0,
    },
  })