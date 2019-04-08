import React, { Component } from 'react';
import GenericList from '../../genericComponents/genericList/GenericList'

export default class GroupsList extends Component{
    constructor(props){
        super(props);
        console.log(query);
        this.state = {
            tableHead:['מקסימום משתתפים', 'יום ושעה', 'מין', 'גיל מקסימלי', 'גיל מינימלי','שם חוג','מזהה קבוצה'],
            tableData: [
                {maxParticipents: 15, groupTime:'שני 16:00', Gender:'בנות', MaxAge:'14', MinAge:'11', HoogName:'כדורגל', id:'1234'},
                {maxParticipents: 16, groupTime:'שלישי 16:00', Gender:'בנים', MaxAge:'13', MinAge:'11', HoogName:'כדורגל', id:'1234'},
                {maxParticipents: 17, groupTime:'שני 15:00', Gender:'בנות', MaxAge:'15', MinAge:'10', HoogName:'כדורסל', id:'1234'},
                {maxParticipents: 18, groupTime:'שני 17:00', Gender:'בנים', MaxAge:'10', MinAge:'8', HoogName:'כדורסל', id:'1234'},
                {maxParticipents: 19, groupTime:'חמישי 16:00', Gender:'בנות', MaxAge:'10', MinAge:'7', HoogName:'פינג פונג', id:'1234'},
                {maxParticipents: 10, groupTime:'רביעי 16:00', Gender:'בנים', MaxAge:'17', MinAge:'15', HoogName:'פינג פונג', id:'1234'},
                {maxParticipents: 11, groupTime:'חמישי 14:00', Gender:'בנות', MaxAge:'12', MinAge:'9', HoogName:'עיצוב וחיטוב', id:'1234'},
                
            ],
            open: false
        };    
    };

    render(){
        const {tableData, tableHead} = this.state;
        return(
          <GenericList tableHead={tableHead} tableData={tableData} listType="groups"/>
        );
    }
}