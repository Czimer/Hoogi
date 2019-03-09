import React from "react";
import { StyleSheet } from "react-native";
import { Subheading, Modal, TextInput, Portal, Button, Title, Card, IconButton } from 'react-native-paper';
import { ImageBrowser } from 'expo-multiple-imagepicker';
import { Permissions } from 'expo'

export default class Message extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            newMessageText: '',
            newPhotos: [],
            imageBrowserOpen: false
        }
    }

    sendNewMessage = () => {
        const { newMessageText, newPhotos } = this.state

        if (newMessageText === '') return
        this.setState({ newMessageText: '', newPhotos: [] })
        this.props.onAccept(newMessageText, newPhotos)
    }

    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            console.log(photos)
            this.setState({
                imageBrowserOpen: false,
                newPhotos: photos
            })
        }).catch((e) => console.log(e))
    }

    openGallery = async () => {
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     base64: true
        // });

        // this.setState(prevState => ({
        //     newPhotos: [...prevState.newPhotos, result.base64]
        // }))
        const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (perm.status === 'granted') {
            this.setState({ imageBrowserOpen: true })
        }
    };

    onNewMessageChange = (text) => {
        this.setState({ newMessageText: text })
    }

    render() {
        const { isOpen, onClose } = this.props
        const { newMessageText, newPhotos, imageBrowserOpen } = this.state

        if (imageBrowserOpen) {
            return (<ImageBrowser max={10} callback={this.imageBrowserCallback} />);
        }

        return (
            <Portal>
                <Modal visible={isOpen} onDismiss={onClose} contentContainerStyle={styles.modal}>
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
                                <Subheading style={{ textAlign: 'right' }}>{`נוספו ${newPhotos.length} תמונות`}</Subheading>
                            }
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained" onPress={this.sendNewMessage}>שלח</Button>
                            <Button style={{ marginLeft: 10 }} onPress={onClose}>בטל</Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
    }
});