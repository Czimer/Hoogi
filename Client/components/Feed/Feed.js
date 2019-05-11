import React from 'react';
import { StyleSheet, View, ScrollView, AsyncStorage } from 'react-native';
import { FAB } from 'react-native-paper';
import Message from './Message';
import NewMessage from "./NewMessage";
import { Manager } from '../../consts';

export default class Feed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAddNewMessageMode: false,
            isManager: false
        }
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager

        this.setState({ isManager })
    }

    onAddMessageMode = () => {
        this.setState({ isAddNewMessageMode: true })
    }

    onCloseMessageMode = () => {
        this.setState({ isAddNewMessageMode: false })
    }

    onAddMessage = (message,photos)=>{
        this.props.onAddNewMessage(message,photos)
        this.onCloseMessageMode()
    }

    render() {
        const { feedMessages, groupId,onAddNewMessage } = this.props
        const { isAddNewMessageMode, isManager } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.messageList}>
                    <ScrollView>
                        {feedMessages.map(message => {
                            return (
                                <Message key={message.id} message={message}></Message>)
                        })}
                    </ScrollView>
                </View>
                {/*TODO: this is a reminder for me to check, if this is a parentview then Fab component should not be appeared */}
                {isManager && groupId && <FAB icon="add" onPress={this.onAddMessageMode} style={styles.fab} />}
                <NewMessage isOpen={isAddNewMessageMode} onClose={this.onCloseMessageMode} onAddNewMessage={this.onAddMessage}  ></NewMessage>
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