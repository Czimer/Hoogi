import React from 'react';
import { View, StyleSheet, AsyncStorage } from "react-native";
import { FAB } from 'react-native-paper';
import Child from './Child';
import request from 'graphql-request';
import appConfig from '../../appConfig';
import tinycolor from "tinycolor2";
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

export default class MyChildrenView extends React.Component {
    static navigationOptions = {
        title: 'הילדים שלי'
    }
    constructor(props) {
        super(props);
        this.state = {
            children: []
        };
    }

    componentDidMount() {
        this.getChildren()
    }

    getChildren = async () => {
        const loginData = await AsyncStorage.getItem('loginData')
        const parentId = JSON.parse(loginData).id
        let children
        const params = {
            parentId
        }
        try {
            const data = await request(appConfig.ServerGraphqlUrl, getChildrenQuery, params)
            children = data.children.nodes
            this.setState({ children })
        } catch (err) {
            console.log(err.message)
            throw err
        }

        this.getPhotosOfChildren(children)
    }

    getPhotosOfChildren = async (children) => {
        const params = {
            childsIds: children.map(child => child.childId)
        }

        try {
            const res = await Axios.post(`${appConfig.ServerApiUrl}/child/getChildsPhotos`, params)
            const photos = res.data
            children = children.map(child => {
                const photoOfChild = photos.find(photo => photo.child_id === child.childId)
                const photo = undefined
                if (photoOfChild) {
                    photo = photoOfChild.filePath
                }
                return { ...child, photo }
            })
            console.log(children)
            this.setState({ children })
        }
        catch (err) {
            console.log(err.message)
            throw err
        }
    }

    onAddChild = async (newChild) => {
        const loginData = await AsyncStorage.getItem('loginData')
        const parentId = JSON.parse(loginData).id

        const { photo } = newChild
        let newChildData;
        delete newChild.photo

        const params = {
            ...newChild,
            parentId
        }

        try {
            const res = await request(appConfig.ServerGraphqlUrl, addChildMutation, params)
            newChildData = res.createChild.child
            await this.uploadPhotoAsync(photo, newChildData.id)

        } catch (err) {
            console.log(err.message)
        }

        if (newChildData) {
            newChildData.photo = photo
            this.setState(prevstate => ({ children: [...prevstate.children, newChildData], isAddChildMode: false }))
        }
    }

    uploadPhotoAsync = async (photo, childId) => {
        const options = {
            method: 'POST',
            body: undefined,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        options.body = createFormData(photo, { childId })
        return await fetch(`${appConfig.ServerApiUrl}/child/upload`, options);
    }

    onOpenAddMode = () => {
        this.props.navigation.navigate('ChildDetails', {
            child: {},
            onAction: this.onAddChild
        })
    }

    onOpenEditMode = (child) => {
        this.props.navigation.navigate('ChildDetails', {
            child,
            onAction: this.onEditChild
        })
    }

    onEditChild = async (editedChild) => {
        const params = {
            ...editedChild,
            color: tinycolor(editedChild.color).toRgbString()
        }

        try {
            await request(appConfig.ServerGraphqlUrl, updateChildMutation, params)
            const childrenList = this.state.children.map(child => child.childId === editedChild.childId ? { ...child, ...editedChild } : child)
            this.setState({ children: childrenList })
        }
        catch (err) {
            console.log(err.message)
        }
    }

    render() {
        const { children } = this.state
        return (
            <View style={styles.container}>
                <ScrollView>
                    {children.map(child => {
                        return <Child key={child.childId} child={child} onEditChild={this.onOpenEditMode}></Child>
                    })}
                </ScrollView>
                <FAB icon="add" onPress={this.onOpenAddMode} style={styles.fab} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});

const getChildrenQuery = `query AllChilds($parentId: String!){
    children:allChildren(filter:{parentId:{equalTo:$parentId}}){
      nodes{
        id
        childId
        firstName
        lastName
        gender
        phone
        birthDate
        color
      }
    } 
  }`

const addChildMutation = `mutation addChild($childId:String!,$firstName:String!,$lastName:String!,$gender:String!,$phone:String!,$birthDate:Date!,$parentId:String!,$color:String!){
    createChild(input:{
      child:{
        childId:$childId
        firstName:$firstName
        lastName:$lastName
        gender:$gender
        phone:$phone
        birthDate:$birthDate
        parentId:$parentId
        color:$color
      }
    }){
      child{
        id
        childId
        firstName
        lastName
        gender
        phone
        birthDate
        color
      }
    }    
  }`

const updateChildMutation = `mutation updateChild($childId:String!,$firstName:String!,$lastName:String!,$gender:String!,$phone:String!,$birthDate:Date!,$color:String!){
    updateChildByChildId(input:
    {
      childId:$childId
      childPatch:{
          firstName:$firstName
          lastName:$lastName
          gender:$gender
          phone:$phone
          birthDate:$birthDate
          color:$color
      }
    }) 
      {
      child{
        childId
      }
    }
  }`

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