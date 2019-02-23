
import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Subheading, Caption, Modal, TextInput, Portal, Button, Title, Card, IconButton, FAB, Appbar } from 'react-native-paper';
import { ImagePicker } from 'expo';
import Message from './Message';

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
            newMessageText: '',
            isAddNewMessageMode: false,
            newPhotos: []
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

    onNewMessageChange = (text) => {
        this.setState({ newMessageText: text })
    }

    sendNewMessage = () => {
        // send it to some api
        //  const {groupId} = this.props
        // const props = {
        //   groupId,
        //   newMessage
        // }
        //  fetch(`path/to/server/`,props).then(()=>{
        //
        //}).catch((err)=>{ // Handle error})
        const { newMessageText, newPhotos } = this.state

        if (newMessageText === '') return

        const message = {
            id: index++,
            Datetime: new Date().toLocaleString(),
            message: newMessageText,
            Photos: newPhotos
        }

        this.setState(prevState => ({
            feedMessages: [...prevState.feedMessages, message]
        }), this.onCloseMessageMode)
    }

    openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true
        });

        this.setState(prevState => ({
            newPhotos: [...prevState.newPhotos, result.base64]
        }))
    };

    onCloseMessageMode = () => {
        this.setState({ isAddNewMessageMode: false, newMessageText: '' })
    }

    render() {
        const { feedMessages, newMessageText, isAddNewMessageMode, newPhotos } = this.state
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.messageList}>
                        {feedMessages.map(message => {
                            return (
                                <Message message={message}></Message>)
                        })}
                    </View>
                    {/*TODO: this is a reminder for me to check, if this is a parentview then Fab component should not be appeared */}
                    {true &&
                        <FAB
                            style={styles.fab}
                            icon="add"
                            onPress={this.onAddMessageMode}
                        />}
                    <Portal>
                        <Modal visible={isAddNewMessageMode} onDismiss={this.onCloseMessageMode} contentContainerStyle={styles.modal}>
                            <Card>
                                <Card.Content>
                                    <Title style={{ textAlign: 'right' }}>הודעה חדשה</Title>
                                    <IconButton
                                        icon="add-a-photo"
                                        size={20}
                                        onPress={this.openGallery}
                                    />
                                    <TextInput
                                        label="הודעה חדשה"
                                        value={newMessageText}
                                        multiline
                                        numberOfLines={4}
                                        onChangeText={this.onNewMessageChange}
                                    />
                                    {newPhotos.length > 0 &&
                                        <Subheading>{`נוספו ${newPhotos.length} תמונות`}</Subheading>
                                    }
                                </Card.Content>
                                <Card.Actions>
                                    <Button mode="contained" onPress={this.sendNewMessage}>שלח</Button>
                                    <Button style={{ marginLeft: 10 }} onPress={this.onCloseMessageMode}>בטל</Button>
                                </Card.Actions>
                            </Card>
                        </Modal>
                    </Portal>
                </View>
            </ScrollView>
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
    },
    card: {
        minHeight: 50,
        backgroundColor: '#E0E0E0',
        margin: 10
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        backgroundColor: '#fff',
    },
    modalHeader: {
        justifyContent: 'center',
    }
});