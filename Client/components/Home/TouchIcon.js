import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
export default class TouchIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { text, image, onPress } = this.props
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Image style={styles.image} source={image} />
                <Text>{text}</Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    image: {
        height: 150,
        width: 150,
        margin: 10
    }
})