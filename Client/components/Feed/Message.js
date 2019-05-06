
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Caption, Card, Subheading } from 'react-native-paper';

export default class Message extends React.PureComponent {
    render() {
        const { message } = this.props
        return (
            <Card style={styles.card}>
                <Subheading>{message.message}</Subheading>
                <Caption>{message.date}</Caption>
                {/* for some reason its not working */}
                {/* {message.Photos.length > 0 && message.Photos.map(photo => {
                    return <Image height={50} width={50} source={{ uri: `data:image/jpeg;base64,${photo}`, isStatic: true, }} />
                })} */}
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        minHeight: 50,
        backgroundColor: '#E0E0E0',
        margin: 10
    }
});