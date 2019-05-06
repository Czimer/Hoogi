import React, { Fragment } from 'react';
import Feed from './Feed';
import { AsyncStorage, Picker, View } from "react-native";
import { flatten, uniqBy } from "lodash";
import request, { GraphQLClient } from 'graphql-request';
import appConfig from '../../appConfig';
import { Manager } from '../../consts';

export default class FeedContainer extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: 'לוח הודעות',
            headerRight: (
                <View>
                    {params && params.groups ?
                        <Picker
                            selectedValue={params.currGroupId}
                            style={{ height: 50, width: 200 }}
                            onValueChange={params.onGroupChange}>
                            {params.groups.map(group => {
                                return <Picker.Item key={group.id} label={group.name} value={group.id} />
                            })}
                        </Picker>
                        : <Fragment></Fragment>}
                </View>
            ),
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            feedMessages: [],
            currGroupId: undefined
        };
    }

    onGroupChange = async (groupId) => {
        if (this.state.currGroupId === groupId) return

        const feedMessages = await this.fetchGroupMessages(groupId)
        const currGroupId = groupId
        this.setState({ currGroupId, feedMessages })
        this.props.navigation.setParams({ currGroupId });
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const paresedLoginData = JSON.parse(loginData)
        const { id, user_type } = paresedLoginData
        const isManager = user_type === Manager
        let data, groups;

        if (isManager) {
            data = await this.fetchManagerGroups(id)
            groups = this.getGroupsFromMangaerData(data)
        }
        else {
            data = await this.fetchParentsChildrenGroups(id)
            groups = this.getGroupsFromParentData(data)
        }

        groups = uniqBy(groups, 'id');

        if (groups.length > 0) {
            const feedMessages = await this.fetchGroupMessages(groups[0].id)
            const currGroupId = groups[0].id
            this.setState({ currGroupId, feedMessages, groups })
            this.props.navigation.setParams({ onGroupChange: this.onGroupChange, groups, currGroupId });
        }
    }

    fetchManagerGroups = async (managerId) => {
        const params = {
            managerId
        }
        try {
            const data = await request(appConfig.ServerGraphqlUrl, groupsOfManager, params)
            return data.allHoogs.nodes
        } catch (err) {
            console.log(err.message)
        }
    }

    getGroupsFromMangaerData = (data) => {
        return flatten(data.map(hoog => hoog.groupsByHoogId.nodes))
    }

    fetchParentsChildrenGroups = async (parentId) => {
        const params = {
            parentId
        }
        try {
            const data = await request(appConfig.ServerGraphqlUrl, groupsOfAllChildren, params)
            return data.allChildren.nodes
        } catch (err) {
            console.log(err.message)
        }
    }

    getGroupsFromParentData = (data) => {
        return flatten(data.map(hoog => hoog.participants.nodes)).map(participant => participant.group)
    }

    fetchGroupMessages = async (groupId) => {
        const params = {
            groupId
        }

        try {
            const data = await request(appConfig.ServerGraphqlUrl, allGroupMessages, params)
            return data.allGroupsMessages.nodes
        } catch (err) {
            console.log(err.message)
        }
    }


    sendNewMessage = async (message, Photos) => {
        const { currGroupId } = this.state
        const params = {
            groupId: currGroupId,
            message,
            date:new Date()
        }

        try {
            const res = await request(appConfig.ServerGraphqlUrl, addNewMessage, params)
            const newMessage = res.createGroupsMessage.groupsMessage
            this.setState(prevState => ({
                feedMessages: [...prevState.feedMessages, newMessage]
            }))
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { currGroupId, feedMessages } = this.state
        console.log(currGroupId)
        return (
            <Feed groupId={currGroupId} feedMessages={feedMessages} onAddNewMessage={this.sendNewMessage} />
        );
    }
}



const groupsOfAllChildren = `
query getAllGroupsFromChildren($parentId:String!){
    allChildren(filter:{parentId:{equalTo:$parentId}}){
        nodes{     
          participants:participantsByChildId{
            nodes{
              group:groupByGroupId{
                id
                name
              }
              child:childByChildId{
                id:childId
              }
            }
          }
        }
    }    
  }`

const groupsOfManager = `
query getAllGroupsByManagerId($managerId:String!){
    allHoogs(filter:{managerId:{equalTo:$managerId}}){
      nodes{
        groupsByHoogId{
          nodes{
            id
            name
          }
        }
      }
    } 
  }`

const allGroupMessages = `
query getAllMessagesByGroupId($groupId:Int!){
    allGroupsMessages(filter:{groupId:{equalTo:$groupId}}){
      nodes{
        id
        message
        date
      }
    }
  }`


const addNewMessage = `
mutation addNewMessageToGroupFeed($groupId:Int!,$message:String!,$date:Date!){
    createGroupsMessage(input:{
  groupsMessage:{
    groupId:$groupId
    message:$message
    date:$date
  }
})   {
  groupsMessage{
    id
    message
    date
  }
} 
}
`