import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { DataTable, FAB, Portal } from 'react-native-paper';


export default class GenericList extends Component{
    constructor(props){
        super(props);
        this.state = {          
            open: false
        };    
    };

    render(){
        const {tableData, tableHead, listType} = this.props;
        return(
            <ScrollView  style = {styles.container}>
                <DataTable>
                    <DataTable.Header>
                    {
                        tableHead.map(cell => {
                            return <DataTable.Title>{cell}</DataTable.Title>
                        })                        
                    }
                    </DataTable.Header>
                    
                    {
                        tableData.map(row =>{
                            return (
                                <DataTable.Row>
                                {
                                    Object.keys(row).map((keyName,item) =>{
                                        return <DataTable.Cell>{row[keyName]}</DataTable.Cell>                                
                                    })
                                }
                                </DataTable.Row>)
                        })
                    }             
                
                </DataTable>  
            {
                listType === "contacts" &&
                    <Portal style={styles.Portal}>
                        <FAB.Group
                        open={this.state.open}
                        icon={this.state.open ? 'today' : 'add'}
                        actions={[
                            { icon: 'add', onPress: () => console.log('Pressed add') },                   
                        ]}
                        onStateChange={({ open }) => this.setState({ open })}
                        onPress={() => {
                            if (this.state.open) {
                            // do something if the speed dial is open
                            }
                        }}
                        />
                     </Portal>                 
            }        
            
        </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {marginTop:30, flex: 1, padding: 30, paddingTop: 30, backgroundColor: '#f3f' },
    head: {marginTop:30,  height: 40, backgroundColor: '#f1f33f' },
    text: { width:30, margin: 7 },
    Portal: {marginBottom:30}
  });


