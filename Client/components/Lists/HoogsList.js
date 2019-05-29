import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'
import axios from 'axios';
import { View, StyleSheet, Picker, AsyncStorage, Alert} from 'react-native';
import { Text, Button, FAB, TextInput, Card, HelperText} from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import Modal from 'react-native-modal';
import appConfig from '../../appConfig'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ScrollView } from 'react-native-gesture-handler';

export default class HoogsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:[ 'תיאור', 'תגיות', 'כתובת','שם חוג','מזהה'],         
            actionsModalVisible: false, 
            hoogId:0,
            addNewHoogModalVisible:false,
            allHoogsArray: [],
            newHoogData:{
                hoogName:'',
                location: '',
                address: '',
                tags: '',              
                description: ''
            },
            add:false,
            edit:false
        };       
        
    };

    getAllHoogsOfManager = () =>{
        axios.post(appConfig.ServerApiUrl + '/hoogs/getAllHoogsByManagerId/:params', {managerId:this.state.managerId}).then(response =>{
            console.log(response.data);
            this.setState({tableData:response.data})
        }).catch(error => {console.log(error)});
    }

    async componentDidMount() {        
        const loginData = await AsyncStorage.getItem('loginData')
        const managerId = JSON.parse(loginData).id;
        this.setState({managerId});
        this.getAllHoogsOfManager();
    }
  

    deleteHoog = (hoogId) =>{

        Alert.alert(
            'שים לב!',
            'האם אתה בטוח שתרצה למחוק את חוג '  + hoogId + '?',
            [
                {
                    text:'כן',
                    onPress: () => this.deleteHoogFinal(hoogId)
                },
                {
                    text:'לא'

                }
            ]
        )       
    }

    deleteHoogFinal =(hoogId) => {
        axios.post(appConfig.ServerApiUrl + '/hoogs/deleteHoogById/:params', {hoogId:hoogId}).then(response =>{
            Alert.alert('החוג נמחק בהצלחה!')
            this.setState({actionsModalVisible:false});
            this.getAllHoogsOfManager();
        }).catch(error => {
            console.log(error);
            Alert.alert('הייתה בעיה במחיקת החוג')            
        });
    }

    openAddNewHoogWindow = () =>{
        this.setState({addNewHoogModalVisible:true, add:true})
    }

    openEditHoogWindow = (event, hoogId) =>{
        
        const currHoogData = this.state.tableData.find(function(currHoog){
            return currHoog.id == hoogId
        });       
        this.setState(prevState => ({addNewHoogModalVisible:true,
             edit:true,
            newHoogData:{
                ...prevState.newHoogData,
                hoogId: currHoogData.id,
                hoogName: currHoogData.name,
                address: currHoogData.address,
                tags: currHoogData.tags.join(', '),              
                description: currHoogData.description     
        }}))
    }


    addNewHoog = () =>{
        var newHoogData = this.state.newHoogData;
        newHoogData.managerId = this.state.managerId;

        axios.post(appConfig.ServerApiUrl + '/hoogs/addNewHoog/:params', {hoogData:newHoogData}).then(response =>{
            console.log(response.data);
            Alert.alert('החוג התווסף בהצלחה!')
            this.closeModal();
            this.getAllHoogsOfManager();
        }).catch(error => {
            console.log(error);
            this.closeModal();
            Alert.alert('הייתה בעיה בהוספת החוג')
        });

    }

    editHoog = () =>{
        const newHoogData = this.state.newHoogData;

        axios.post(appConfig.ServerApiUrl + '/hoogs/editHoog/:params', {hoogData:newHoogData}).then(response =>{
            console.log(response.data);
            Alert.alert('החוג התעדכן בהצלחה!')
            this.closeModal();
            this.getAllHoogsOfManager();
        }).catch(error => {
            console.log(error);
            this.closeModal();
            Alert.alert('הייתה בעיה בעדכון החוג')
        });
    }
    

    handleLongPress = (event, row) =>{       
        this.setState(
            {
                actionsModalVisible: true,
                hoogId: row.id
            });
    }

    handleSave = () => {
        if(this.state.add == true){
            this.addNewHoog();
        }
        else if(this.state.edit == true){
            this.editHoog();
        }
    }

    closeModal = () =>{
        this.setState(
            {
                actionsModalVisible: false,
                addNewHoogModalVisible: false,
                add: false,
                edit:false
            });
    }

    render(){
        const {tableData, tableHead, actionsModalVisible, hoogId, addNewHoogModalVisible, newHoogData} = this.state;
        return(
            <View>
            {

            (tableData !== undefined) &&  
            <GenericList tableHead={tableHead} handleLongPress={this.handleLongPress} tableData={tableData}>
            {/* modal view for specific hoog handling */}
                <Modal isVisible={actionsModalVisible}>
                        <Card style={{marginTop: 22, backgroundColor:'#FFF'}}>                               
                            <Button onPress={() => this.deleteHoog(hoogId)}>
                                <Text>מחק חוג {hoogId}</Text>
                            </Button>                           
                            <Button onPress={(event) => this.openEditHoogWindow(event, hoogId)}>
                                <Text>ערוך את פרטי החוג</Text>
                            </Button>
                            <Button mode="outlined" onPress={this.closeModal}>
                                <Text>בטל</Text>
                            </Button>                                                 
                        </Card>
                </Modal>  
                {/* modal view for add/edit hoog */}
    
                <Modal isVisible={addNewHoogModalVisible}>
                    <ScrollView swipeArea={0}>
                        <Card style={{marginTop: 22, backgroundColor:'#FFF', width:'100%'}}>  
                            <Card.Content>
                                <TextInput label="שם החוג" value={newHoogData.hoogName} 
                                onChangeText={hoogName => this.setState(prevState =>({newHoogData: {...prevState.newHoogData, hoogName:hoogName}}))}/>

                                <Text style={{textAlign:'right'}}>מיקום</Text>
                                {/*  beginning of google search */}
                                <GooglePlacesAutocomplete
                                    placeholder='Search'
                                    minLength={3} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='auto'    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true                            ;
                                        const lat = details.geometry.location.lat;
                                        const lng = details.geometry.location.lng;
                                        this.setState(prevState => ({newHoogData:{...prevState.newHoogData, location: lat + "," + lng, address:data.description}}));
                                    }}
                                    
                                    getDefaultValue={() => ''}
                                    
                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: appConfig.locationApiKey, // TODO: save the key somewhere safer
                                        language: 'iw', // language of the results                           
                                    }}
                                    
                                    styles={{
                                        textInputContainer: {
                                        width: '100%'
                                        },
                                        description: {
                                        fontWeight: 'bold'
                                        },
                                        predefinedPlacesDescription: {
                                        color: '#1faadb'
                                        }
                                    }}
                                    
                                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                                    currentLocationLabel="מיקום נוכחי"
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'food'
                                    }}
                                
                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    // predefinedPlaces={[homePlace, workPlace]}
                                
                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                    // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                                    // renderRightButton={() => <Text>Custom text after the input</Text>}
                                />

                                <TextInput label="תגיות" value={newHoogData.tags} 
                                onChangeText={value => this.setState(prevState =>({newHoogData: {...prevState.newHoogData, tags:value}}))}/>                                 

                                <TextInput label="תיאור" value={newHoogData.description}      
                                onChangeText={value => this.setState(prevState =>({newHoogData: {...prevState.newHoogData, description:value}}))}/>                                                           
                            </Card.Content> 
                            <Card.Actions>
                                <Button mode="contained" onPress={this.handleSave}>
                                    <Text>שמור חוג</Text>
                                </Button>                                
                                <Button mode="outlined" onPress={this.closeModal}>
                                    <Text>בטל</Text>
                                </Button>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </Modal> 
                                
                <FAB style={styles.fab} icon="add" onPress={this.openAddNewHoogWindow}/>
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
    propertyText:{
        fontWeight: 'bold',
        textAlign:'right'
    }
  })