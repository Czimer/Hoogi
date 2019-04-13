import React from 'react';
import { View, StyleSheet } from "react-native";
import { FAB } from 'react-native-paper';
import Child from './Child';
import AddChild from "./AddChild";

const someonesChildren = [{
    id: '111122233',
    firstName: 'ילד',
    lastName: 'ראשון',
    gender: 'זכר',
    phone: '04567089765',
    birthDate: '19/4/2004',
    photo: undefined
},
{
    id: '111124433',
    firstName: 'ילד',
    lastName: 'שני',
    gender: 'זכר',
    phone: '04567089765',
    birthDate: '19/4/2004',
    photo: undefined
}]


export default class MyChildrenView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            children: someonesChildren,
            isAddChildMode: false
        };
    }

    componentDidMount() {
        // DOTO: implement a call to server
    }

    onAddChild = (newChild) => {
        // some api call

        this.setState(prevstate => ({ children: [...prevstate.children, newChild], isAddChildMode: false }))
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
                    return <Child key={child.id} child={child} onEditChild={this.onChildEdit}></Child>
                })}
                <FAB icon="add" onPress={this.onOpenAddMode} style={styles.fab} />
                {isAddChildMode && <AddChild onClose={this.onCloseAddMode} onAccept={this.onAddChild}></AddChild>}
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