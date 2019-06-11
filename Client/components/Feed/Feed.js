import React from 'react';
import { StyleSheet, View, ScrollView, AsyncStorage } from 'react-native';
import { FAB } from 'react-native-paper';
import Message from './Message';
import NewMessage from "./NewMessage";
import { Manager } from '../../consts';
import PhotosModal from "./PhotosModal";
import Axios from 'axios';
import appConfig from '../../appConfig';

export default class Feed extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAddNewMessageMode: false,
            isPhotoMode: false,
            isManager: false,
            photos: []
        }
    }

    async componentDidMount() {
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager

        this.setState({ isManager })
    }

    onAddMessageMode = () => this.setState({ isAddNewMessageMode: true })
    onCloseMessageMode = () => this.setState({ isAddNewMessageMode: false })

    onClosePhotosMode = () => this.setState({ isPhotoMode: false })

    onAddMessage = (message, photos) => {
        this.props.onAddNewMessage(message, photos)
        this.onCloseMessageMode()
    }

    getPhotosByMessageId = async (messageId) => {

        const loginData = await AsyncStorage.getItem('loginData')
        const paresedLoginData = JSON.parse(loginData)
        const { id, user_type } = paresedLoginData
        const isManager = user_type === Manager

        const params = {
            params: {
                messageId,
                entityId:id,
                isManager
            }
        }

        try {
            const photos = await Axios.get(`${appConfig.ServerApiUrl}/groups/getPhotosLinks`, params)
            this.setState({ photos: photos.data, isPhotoMode: true })
        }
        catch (err) {
            console.log("----------------------------------------")
            console.log(err.message)
        }
    }

    render() {
        const { feedMessages, groupId } = this.props
        const { isAddNewMessageMode, isManager, isPhotoMode, photos } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.messageList}>
                    <ScrollView>
                        {feedMessages.map(message => {
                            return (
                                <Message key={message.id} message={message} getPhotosByMessageId={this.getPhotosByMessageId}></Message>)
                        })}
                    </ScrollView>
                </View>
                {/*TODO: this is a reminder for me to check, if this is a parentview then Fab component should not be appeared */}
                {isManager && groupId && <FAB icon="add" onPress={this.onAddMessageMode} style={styles.fab} />}
                <NewMessage isOpen={isAddNewMessageMode} onClose={this.onCloseMessageMode} onAddNewMessage={this.onAddMessage}  ></NewMessage>
                <PhotosModal isOpen={isPhotoMode} photos={photos} onClose={this.onClosePhotosMode} />
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
        left: 0,
        bottom: 0,
    }
});