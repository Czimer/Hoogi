import React, { Component } from 'react';

export default class ContactsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            tableHead:['ת"ז', 'גיל', 'מין', 'מס טלופן החניך', 'מספר טלפון ההורה','שם החניך','שם ההורה'],
            tableData: [
                {id:'315329052', age:'23', gender:'נקבה', phoneNumer:'0523067889', parentNumber:'000000000', name:'דנה שקד', parentName: 'אימוש שלי'},
                {id:'305054363', age:'28', gender:'זכר', phoneNumer:'0536762334', parentNumber:'000000000', name:'יניב', parentName: 'אדר'},
                {id:'57755233', age:'56', gender:'זכר', phoneNumer:'0545608850', parentNumber:'000000000', name:'יואב שקד', parentName: 'סבתוש'},
                {id:'57454019', age:'56', gender:'נקבה', phoneNumer:'0524473254', parentNumber:'000000000', name:'דרית אורן שקד', parentName: 'גם סבתוש'},
                {id:'11111111', age:'18', gender:'נקבה', phoneNumer:'0528080685', parentNumber:'000000000', name:'נועה שקד', parentName: 'אימוש שלי'},
                {id:'22222222', age:'25', gender:'זכר', phoneNumer:'0526337378', parentNumber:'000000000', name:'עידו שקד', parentName: 'אימוש שלי'},
            ],
            open: false
        };    
    };

    render(){
        const {tableData, tableHead} = this.state;
        return(
          <List tableHead={tableHead} tableData={tableData} listType="contacts"/>
        );
    }
}