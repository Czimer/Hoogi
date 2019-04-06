
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import Message from './Message';
import NewMessage from "./NewMessage";

const feedMessagesInit = [
    {
        id: 'd4a56sd4asd4wq4d',
        Datetime: new Date().toLocaleString(),
        message: "agado do do do",
        Photos: []
    }, {
        id: 'd4a56sd4asd4wq4qqqq',
        Datetime: new Date().toLocaleString(),
        message: "Ish Katan",
        Photos: []
    }, {
        id: 'd4a56sd4asd4wq4dggg',
        Datetime: new Date().toLocaleString(),
        message: "Ose Cafe",
        Photos: []
    },
    {
        id: 'd4a56sd4asd4wq4dggga',
        Datetime: new Date().toLocaleString(),
        message: "very very long, pass pass its a come. i can run very fast and score many goals",
        Photos: []
    }
]

let index = 4

export default class Feed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            feedMessages: feedMessagesInit,
            isAddNewMessageMode: false
        }
    }

    // TODO: remove from comment after i have server and a component that can inject group id
    // componentDidMount(){
    //   const {groupId} = this.props
    //   fetch(`path/to/server/GroupId=${groupId}`)
    //   .then((resp) => resp.json())
    //   .then((data)=>
    //   this.setState({events:data})
    //   )
    //   .catch(err=>{
    //     // Hnadle error
    //   })
    // }

    onAddMessageMode = () => {
        this.setState({ isAddNewMessageMode: true })
    }

    onCloseMessageMode = () => {
        this.setState({ isAddNewMessageMode: false })
    }

    sendNewMessage = (message, Photos) => {
        // send it to some api
        //  const {groupId} = this.props
        // const props = {
        //   groupId,
        //   newMessage
        // }
        //  fetch(`path/to/server/`,props).then(()=>{
        //
        //}).catch((err)=>{ // Handle error})

        const newMessage = {
            id: index++,
            Datetime: new Date().toLocaleString(),
            message,
            Photos
        }

        this.setState(prevState => ({
            feedMessages: [...prevState.feedMessages, newMessage]
        }), this.onCloseMessageMode)
    }

    render() {
        const { feedMessages, isAddNewMessageMode } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.messageList}>
                    {feedMessages.map(message => {
                        return (
                            <Message key={message.id} message={message}></Message>)
                    })}
                </View>
                {/*TODO: this is a reminder for me to check, if this is a parentview then Fab component should not be appeared */}
                {true && <FAB icon="add" onPress={this.onAddMessageMode} style={styles.fab} />}
                <NewMessage isOpen={isAddNewMessageMode} onClose={this.onCloseMessageMode} onAccept={this.sendNewMessage}  ></NewMessage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageList: {
        width: '100%'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
});