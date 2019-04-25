import React, { Component } from 'react';
import axios from 'axios'
import GenericList from '../../genericComponents/genericList/GenericList'
import { FAB, Portal } from 'react-native-paper';
import { Text, View, StyleSheet, ScrollView } from 'react-native';



export default class ContactsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:['ת"ז', 'גיל', 'מין', 'מס טלפון החניך', 'מספר טלפון ההורה','שם החניך','שם ההורה'],            
            open: false
        };    
    };

    componentDidMount = () =>{ // TODO: change to the wanted group id
        const { groupId } = this.props;
        // axios.get('http://192.168.1.10:3000/api/parentsAndChilds', {params:{groupId:groupId}}).then(response =>{ TODO: 
        axios.get('http://192.168.1.10:3000/api/parentsAndChilds', {params:{groupId:3}}).then(response =>{
            this.setState({tableData:response.data});
        }).catch(error => {console.log("dana banana \n" + error)});
    }

    addContact = (contId) =>{

    }

    editContact = (contId) =>{

    }

    removeContact = (contId) =>{

    }

    render(){
        const {tableData, tableHead} = this.state;
        return(
            <View>            
               {
                   (tableData !== undefined) &&  
                   <GenericList tableHead={tableHead} tableData={tableData}/> }
                {/* {           
                    <Portal>
                        <FAB.Group
                        open={this.state.open}
                        icon={this.state.open ? 'today' : 'add'}
                        actions={[
                            { icon: 'addContact', onPress: () => console.log('Pressed add') }                         
                        ]}
                        onStateChange={({ open }) => this.setState({ open })}
                        onPress={() => {
                            if (this.state.open) {
                            // do something if the speed dial is open
                            }
                        }}
                        />
                    </Portal>                        
                }         */}
            </View>
        );
    }
}