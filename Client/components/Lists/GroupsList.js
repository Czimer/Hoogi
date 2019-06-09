import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'
import axios from 'axios';
import { View, StyleSheet, Picker, AsyncStorage, Alert} from 'react-native';
import { Text, Button, FAB, TextInput, Card, HelperText} from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import Modal from 'react-native-modal';
import appConfig from '../../appConfig'
import TimePicker from 'react-native-simple-time-picker';
import { ScrollView } from 'react-native-gesture-handler';

export default class GroupsList extends Component{
    static navigationOptions = {
        title: 'הקבוצות שלי'
    }
    constructor(props){
        super(props);
        this.state = {
            // tableHead:['ציוד נלווה','מקסימום משתתפים', 'שעה', 'יום', 'מין', 'גיל מקסימלי', 'גיל מינימלי','קבוצה','מזהה'],         
            tableHead:['מזהה','קבוצה', 'גיל מינימלי', 'גיל מקסימלי', 'מין', 'יום', 'שעה','מקסימום משתתפים','ציוד נלווה'],         
            actionsModalVisible: false, 
            groupId:0,
            addNewGroupModalVisible:false,
            allHoogsArray: [],
            newGroupData:{
                selectedMinutes: 0,
                selectedHours: 12,
                minAge:1,
                maxAge:20,
                hoogId:1,
                gender:'male',
                day:'ראשון',
                maxParticipants: 10,
                groupName: '',
                equipment: ''
            },
            add:false,
            edit:false
        };       
        
    };

    getAllGroupsOfManager = () =>{
        axios.post(appConfig.ServerApiUrl + '/groups/:params', {managerId:this.state.managerId}).then(response =>{
            console.log(response.data);
            this.setState({tableData:response.data})
        }).catch(error => {console.log(error)});
    }

    async componentDidMount() {        
        const loginData = await AsyncStorage.getItem('loginData')
        const managerId = JSON.parse(loginData).id;
        this.setState({managerId});
        this.getAllGroupsOfManager();
        this.getAllHoogsNamesOfManager();
    }

    getAllHoogsNamesOfManager(){            
        axios.post(appConfig.ServerApiUrl + '/hoogs/getAllHoogsNames', {managerId:this.state.managerId}).then(response =>{
            this.setState(prevState =>({
                allHoogsArray:response.data,
                newGroupData:{
                    ...prevState.newGroupData,
                    hoogId: response.data[0].id
                }
            }));
        }).catch(error => console.log(error));
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
    }

    deleteGroupFinal =(groupId) => {
        axios.post(appConfig.ServerApiUrl + '/groups/deleteGroupById/:params', {groupId:groupId}).then(response =>{
            Alert.alert('הקבוצה נמחקה בהצלחה!')
            this.setState({actionsModalVisible:false});
            this.getAllGroupsOfManager();
        }).catch(error => {
            console.log(error);
            Alert.alert('הייתה בעיה במחיקת הקבוצה')            
        });
    }

    openAddNewGroupWindow = () =>{
        this.setState({addNewGroupModalVisible:true, add:true})
    }

    openEditGroupWindow = (event, groupId) =>{
        
        const currGroupData = this.state.tableData.find(function(currGroup){
            return currGroup.id == groupId
        });       
        this.setState(prevState => ({addNewGroupModalVisible:true,
             edit:true,
            newGroupData:{
                ...prevState.newGroupData,
                groupId: currGroupData.id,
                minAge: currGroupData.min_age,
                maxAge: currGroupData.max_age,
                gender: currGroupData.gender,
                day: currGroupData.yom,
                selectedHours: parseInt(currGroupData.shaa.split(':')[0]),
                selectedMinutes: parseInt(currGroupData.shaa.split(':')[1]),
                maxParticipants: currGroupData.max_participants,
                groupName: currGroupData.name,
                equipment: currGroupData.equipment       
        }}))
    }


    addNewGroup = () =>{
        const newGroupData = this.state.newGroupData;

        axios.post(appConfig.ServerApiUrl + '/groups/addNewGroup/:params', {groupData:newGroupData}).then(response =>{
            console.log(response.data);
            Alert.alert('הקבוצה התווספה בהצלחה!')
            this.closeModal();
            this.getAllGroupsOfManager();
        }).catch(error => {
            console.log(error);
            this.closeModal();
            Alert.alert('הייתה בעיה בהוספת הקבוצה')
        });

    }

    editGroup = () =>{
        const newGroupData = this.state.newGroupData;

        axios.post(appConfig.ServerApiUrl + '/groups/editNewGroup/:params', {groupData:newGroupData}).then(response =>{
            console.log(response.data);
            Alert.alert('הקבוצה התעדכנה בהצלחה!')
            this.closeModal();
            this.getAllGroupsOfManager();
        }).catch(error => {
            console.log(error);
            this.closeModal();
            Alert.alert('הייתה בעיה בעדכון הקבוצה')
        });
    }
    

    handleLongPress = (event, row) =>{       
        // insert a check if the user is manager - only manager is able to insert, edit or delete
        this.setState(
            {
                actionsModalVisible: true,
                groupId: row.id
            });
    }

    handleSave = () => {
        if(this.state.add == true){
            this.addNewGroup();
        }
        else if(this.state.edit == true){
            this.editGroup();
        }
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false,
                addNewGroupModalVisible: false,
                add: false,
                edit:false
            });
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, groupId, addNewGroupModalVisible, newGroupData} = this.state;
        return(
            <View>
            {

            (tableData !== undefined) &&  
            <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
            {/* modal view for specific group handling */}
                <Modal isVisible={actionsModalVisible}>
                        <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>                               
                            <Button onPress={() => this.removeGroup(groupId)}>
                                <Text>מחק קבוצה {groupId}</Text>
                            </Button>
                            <Button onPress={() => this.goToContactList(groupId)}>
                                <Text>עבור לרשימת המשתתפים בקבוצה</Text>
                            </Button>
                            <Button onPress={(event) => this.openEditGroupWindow(event, groupId)}>
                                <Text>ערוך את פרטי הקבוצה</Text>
                            </Button>
                            <Button mode="outlined" onPress={this.closeModal}>
                                <Text>בטל</Text>
                            </Button>                                                 
                        </Card>
                </Modal>  
                {/* modal view for add/edit group */}
    
                <Modal isVisible={addNewGroupModalVisible}>
                    <ScrollView swipeArea={0}>
                        <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>  
                            <Card.Content>
                                {
                                    this.state.add && 
                                    <>
                                        <Text style={styles.propertyText}>סוג חוג</Text>                   
                                        <Picker
                                            selectedValue={newGroupData.hoogId}                    
                                            style={{height: 50, width: '90%'}}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState(prevState => ({newGroupData: {...prevState.newGroupData, hoogId:itemValue}}))}>
                                                {
                                                    this.state.allHoogsArray.map((currHoog,i) =>
                                                    {
                                                        return <Picker.Item key={currHoog.id} label={currHoog.name} value={currHoog.id}/>}
                                                )}
                                        </Picker>
                                    </>
                                }  
                                <TextInput label="שם הקבוצה" value={newGroupData.groupName} 
                                onChangeText={groupName => this.setState(prevState =>({newGroupData: {...prevState.newGroupData, groupName:groupName}}))}/>
                                    
                                <Text style={styles.propertyText}>גיל מינימלי</Text>
                                    <NumericInput initValue={newGroupData.minAge} minValue={1}
                                        onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, minAge:value}}));}} />
                                    <Text style={styles.propertyText}>גיל מקסימלי</Text>
                                    <NumericInput maxValue={99} initValue={newGroupData.maxAge}
                                        onChange={value => this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxAge:value}}))} />
                                    
                                    <Text style={styles.propertyText}>מין</Text>
                                    <Picker 
                                        selectedValue={newGroupData.gender}
                                        style={{height: 50, width: '90%'}}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState(prevState => ({newGroupData: {...prevState.newGroupData, gender:itemValue}}))}>
                                        <Picker.Item label="זכר" value="Male" />
                                        <Picker.Item label="נקבה" value="Female" />
                                    </Picker>
                                    <Text style={styles.propertyText}>יום</Text>
                                    <Picker key="days"
                                        selectedValue={newGroupData.day}
                                        style={{height: 50, width: '90%'}}
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
                                    <Text style={styles.propertyText}>שעה</Text>
                                    <TimePicker
                                        selectedHours={newGroupData.selectedHours}
                                        //initial Hourse value
                                        selectedMinutes={newGroupData.selectedMinutes}
                                        //initial Minutes value
                                        onChange={(hours, minutes) => this.setState(prevState => ({newGroupData: 
                                        {
                                            ...prevState.newGroupData, 
                                            selectedHours: hours, 
                                            selectedMinutes: minutes 
                                        }}))}
                                    />  
                                    <Text style={styles.propertyText}>מספר משתתפים מקסימלי</Text>
                                    <NumericInput minValue={5} maxValue={20} initValue={newGroupData.maxParticipants}
                                        onChange={value => {this.setState(prevState => ({newGroupData: {...prevState.newGroupData, maxParticipants:value}}));}} />                        
                                    {/* ציוד */}                                  
                                     <TextInput label="ציוד נלווה" value={newGroupData.equipment} 
                                    onChangeText={value => this.setState(prevState =>({newGroupData: {...prevState.newGroupData, equipment:value}}))}/>                                 
                            </Card.Content> 
                            <Card.Actions>
                                <Button mode="contained" onPress={this.handleSave}>
                                    <Text>שמור קבוצה</Text>
                                </Button>                                
                                <Button mode="outlined" onPress={this.closeModal}>
                                    <Text>בטל</Text>
                                </Button>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </Modal> 
                                
                <FAB style={styles.fab} icon="add" onPress={this.openAddNewGroupWindow}/>
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
      right: 240,
      bottom: 0,
    },
    propertyText:{
        fontWeight: 'bold',
        textAlign:'right'
    }
  })