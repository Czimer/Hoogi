
import React from 'react';
import { Image, StyleSheet, Alert, View } from 'react-native';
import { Caption, Card, IconButton, Avatar } from 'react-native-paper';
import appConfig from "../../appConfig";
import Axios from 'axios';


export default class Message extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            photos: undefined
        }
    }


    displayPhotos = async () => {
        this.props.getPhotosByMessageId(this.props.message.id)
    }
    render() {
        const { message } = this.props

        const dateTime = new Date(message.date)

        return (
            <React.Fragment>
                <Card.Title title={message.message} titleStyle={{textAlign:'right',margin:10}} subtitleStyle={{textAlign:'right',margin:10}}
                    subtitle={`${dateTime.toLocaleDateString()}, ${dateTime.toLocaleTimeString()}`}
                    left={() => message.numberOfPhotos ? <IconButton onPress={this.displayPhotos} icon="photo" /> : <View></View>} />
            </React.Fragment>
        );
    }
}



const styles = StyleSheet.create({
    card: {
        minHeight: 50,
        backgroundColor: '#E0E0E0',
        margin: 10
    },
    message:{
    }
});