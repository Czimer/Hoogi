import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'
import axios from 'axios';

export default class GroupsList extends Component{
    constructor(props){
        super(props);
        console.log(query);
        this.state = {
            tableHead:['מקסימום משתתפים', 'שעה', 'יום', 'מין', 'גיל מקסימלי', 'גיל מינימלי','שם חוג','מזהה קבוצה'],         
            open: false
        };    
    };

    componentDidMount = () =>{ //TODO: change the managerId according to the current signed manager
        axios.get('http://192.168.1.10:3000/api/groups/', {params:{managerId:893032893}}).then(response =>{
            console.log(response.data);
            this.setState({tableData:response.data})
        }).catch(error => {console.log(error)});
    }

    render(){
        const {tableData, tableHead} = this.state;
        return(
          <GenericList tableHead={tableHead} tableData={tableData}/>
        );
    }
}