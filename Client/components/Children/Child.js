import React from 'react';
import { List, Avatar, Text, IconButton } from "react-native-paper";
import { View, StyleSheet, Image } from "react-native";
import tinycolor from 'tinycolor2';

export default class Child extends React.Component {
   
    renderImage = () => {
        const { child } = this.props
        if (child.photo && child.photo.uri) {
            return <Image style={styles.image} source={{ uri: child.photo.uri }} />
        }

        if (child.gender === 'male')
            return <Image style={styles.image} source={require('../../assets/empty-man.png')} />

        return <Image style={styles.image} source={require('../../assets/empty-woman.png')} />
    }

    moveToEdit = () => {
        const { child, onEditChild } = this.props
        onEditChild(child)
    }

    render() {
        const { child } = this.props
        return (
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    {this.renderImage()}
                </View>
                <View style={{ flex: 3 }}>
                    <Text>שם - {`${child.firstName} ${child.lastName}`}</Text>
                    <Text>מין - {child.gender}</Text>
                    <Text>טלפון - {child.phone}</Text>
                    <Text>תאריך לידה - {child.birthDate}</Text>
                    <Text style={{ color: tinycolor(child.color).toRgbString() }}>הצבע של הילד</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <IconButton
                        icon="update"
                        size={20}
                        onPress={this.moveToEdit}
                    />
                </View>
                {/* <View style={{ flex: 1 }}>
                    <IconButton
                        icon="delete"
                        size={20}
                        onPress={this.moveToEdit}
                    />
                </View> */}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 12,
        marginTop: 12,
        alignItems:'center',
        // marginBottom: 12,
        // borderBottomColor: 'grey',
        // borderBottomWidth: 1,
    },
    image: {
        height: 75,
        width: 75
    }
});