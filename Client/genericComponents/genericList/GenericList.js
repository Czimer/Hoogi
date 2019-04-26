import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, FAB, Portal } from 'react-native-paper';


export default class GenericList extends Component{
    constructor(props){
        super(props);
        this.state = {          
            open: false
        };    
    };

    render(){
        const {tableHead, tableData} = this.props;       
        return(
            <>
                <DataTable>
                    <DataTable.Header>
                    {
                        tableHead.map(cell => {
                            return <DataTable.Title key={cell}>{cell}</DataTable.Title>
                        })                        
                    }
                    </DataTable.Header>
                    
                    {
                        (tableData !== undefined) && tableData.map((row, rowIndex) =>{
                            return (
                                <DataTable.Row key={rowIndex}>
                                { 
                                    Object.keys(row).map((keyName) =>{
                                        return (<DataTable.Cell key={row[keyName]}>{row[keyName]}</DataTable.Cell>)
                                    })
                                }
                                </DataTable.Row>)
                        })
                    }   

                    {/* <DataTable.Pagination
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
                    />           */}
                
                </DataTable>      
        </>
        );
    }
}

const styles = StyleSheet.create({
    container: {marginTop:30, flex: 1, padding: 30, paddingTop: 30, backgroundColor: '#fff' },
    head: {marginTop:30,  height: 40, backgroundColor: '#fff' },
    text: { width:30, margin: 7 }
  });


