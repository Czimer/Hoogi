import React from 'react';
import { View, StyleSheet, AsyncStorage } from "react-native";
import { FAB } from 'react-native-paper';
import Child from './Child';
import AddChild from "./AddChild";
import request from 'graphql-request';
import appConfig from '../../appConfig';


export default class MyChildrenView extends React.Component {
    static navigationOptions = {
        title: 'הילדים שלי'
    }
    constructor(props) {
        super(props);
        this.state = {
            children: [],
            isAddChildMode: false
        };
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const parentId = JSON.parse(loginData).id

        const params = {
            parentId
        }
        try {
            const data = await request(appConfig.ServerGraphqlUrl, getChildrenQuery, params)
            this.setState({ children: data.children.nodes })
        } catch (err) {
            console.log(err.message)
        }
    }

    onAddChild = async (newChild) => {
        // some api call
        const loginData = await AsyncStorage.getItem('loginData')
        const parentId = JSON.parse(loginData).id

        const params = {
            ...newChild,
            parentId
        }

        try {
            await request(appConfig.ServerGraphqlUrl, addChildMutation, params)
            this.setState(prevstate => ({ children: [...prevstate.children, newChild], isAddChildMode: false }))
        } catch (err) {
            console.log(err.message)
        }
    }

    onOpenAddMode = () => this.setState({ isAddChildMode: true })
    onCloseAddMode = () => this.setState({ isAddChildMode: false })

    onEditChild = (editedChild) => {
        const childrenList = this.state.children.map(child => child.id == editedChild.id ? editedChild : child)
        this.setState({ children: childrenList })
    }

    render() {
        const { children, isAddChildMode } = this.state
        return (
            <View style={styles.container}>
                {children.map(child => {
                    return <Child key={child.childId} child={child} onEditChild={this.onChildEdit}></Child>
                })}
                <FAB icon="add" onPress={this.onOpenAddMode} style={styles.fab} />
                {isAddChildMode && <AddChild onClose={this.onCloseAddMode} onAdd={this.onAddChild}></AddChild>}
            </View>
        );
    }
}

const getChildrenQuery = `query AllChilds($parentId: String!){
    children:allChildren(filter:{parentId:{equalTo:$parentId}}){
      nodes{
        childId
        firstName
        lastName
        gender
        phone
        birthDate
      }
    } 
  }`

const addChildMutation = `mutation addChild($childId:String!,$firstName:String!,$lastName:String!,$gender:String!,$phone:String!,$birthDate:Date!,$parentId:String!){
    createChild(input:{
      child:{
        childId:$childId
        firstName:$firstName
        lastName:$lastName
        gender:$gender
        phone:$phone
        birthDate:$birthDate
        parentId:$parentId
      }
    }){
      child{
        id
      }
    }    
  }`

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