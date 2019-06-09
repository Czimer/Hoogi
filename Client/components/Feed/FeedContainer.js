import React, { Fragment } from 'react';
import Feed from './Feed';
import { AsyncStorage, Picker, View, Platform, Alert } from "react-native";
import { flatten, uniqBy } from "lodash";
import request from 'graphql-request';
import appConfig from '../../appConfig';
import { Manager } from '../../consts';
import PushNotificationService from '../../helpers/PushNotificationService';
import { pushNotificationTypes } from "../../enums";

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
                                return <Picker.Item key={group.id} label={group.name} value={group.id} color={params.currGroupId === group.id ? '#d6d6d6' : 'black'} />
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
            currGroupId: undefined,
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
            this.setState({ currGroupId, groups, feedMessages })
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
            return data.allGroupsMessages.nodes.map(message => {
                return {
                    ...message,
                    numberOfPhotos: message.totalPhotos.totalCount
                }
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    uploadPhotosAsync = async (photos, messageId) => {
        const options = {
            method: 'POST',
            body: undefined,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        const photoPromises = photos.map(async photo => {
            options.body = createFormData(photo, { messageId })
            return await fetch(`${appConfig.ServerApiUrl}/general/upload`, options);
        });

        await Promise.all(photoPromises)
    }


    sendNewMessage = async (message, Photos) => {
        const { currGroupId } = this.state
        let messageUploaded = false
        let newMessage;
        const params = {
            groupId: currGroupId,
            message
        }

        try {
            const res = await request(appConfig.ServerGraphqlUrl, addNewMessage, params)
            newMessage = res.createGroupsMessage.groupsMessage
            messageUploaded = true
            this.sendPushNotifications()

            await this.uploadPhotosAsync(Photos, newMessage.id)
        } catch (err) {
            console.log(err)
            if (messageUploaded) {
                Alert.alert('שגיאה בהעלאת התמונות', 'לא הצלחנו להעלות את כל התמונות או את חלכן')
            }
        }

        if (newMessage) {
            newMessage.numberOfPhotos = Photos.length
            this.setState(prevState => ({
                feedMessages: [newMessage, ...prevState.feedMessages]
            }))
        }
    }

    sendPushNotifications = () => {
        const { currGroupId, groups } = this.state
        const group = groups.find(group => group.id === currGroupId)
        PushNotificationService.sendPushNotification(pushNotificationTypes.NEW_MESSAGE_TO_FEED, group)
    }

    render() {
        const { currGroupId, feedMessages } = this.state
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
    allGroupsMessages(filter:{groupId:{equalTo:$groupId}},orderBy:[DATE_DESC]){
      nodes{
        id
        message
        date
        totalPhotos:groupMessagesPhotosByGroupMessageId{
          totalCount
        }
      }
    }
  }`


const addNewMessage = `
mutation addNewMessageToGroupFeed($groupId:Int!,$message:String!){
    createGroupsMessage(input:{
  groupsMessage:{
    groupId:$groupId
    message:$message
  }
})   {
  groupsMessage{
    id
    message
    date
  }
} 
}`


//async function 

const createFormData = (photo, body) => {
    const data = new FormData();

    let localUri = photo.uri;
    let fileName = localUri.split('/').pop();

    let type = `image/jpeg`;

    data.append("photo", {
        name: fileName,
        type: type,
        uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("content://", "")
    });

    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });

    return data;
};