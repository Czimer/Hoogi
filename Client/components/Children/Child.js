import React from 'react';
import { List, Avatar, Text, Button, TextInput, HelperText } from "react-native-paper";
import { View, Picker, StyleSheet } from "react-native";
import DatePicker from "../../genericComponents/Pickers/DatePicker";
import appConfig from '../../appConfig';
import { HueSlider } from "react-native-color";
import tinycolor from 'tinycolor2';

export default class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false
        };
    }

    _handlePress = () =>
        this.setState({
            isExpanded: !this.state.isExpanded
        });


    // TODO: when i can show photo, show it!
    renderAvatar = () => {
        const { child } = this.props
        if (child.photo)
            return <Avatar.Image source={`${appConfig.baseServerUrl}/${photo}`} />

        return <Avatar.Text size={36} label={`${child.firstName[0]}${child.lastName[0]}`} />
    }

    moveToEdit = () => {
        const { child, onEditChild } = this.props
        onEditChild(child)
    }

    render() {
        const { isExpanded } = this.state
        const {child} = this.props
        return (
            <List.Accordion
                title={`${child.firstName} ${child.lastName}`}
                left={() => this.renderAvatar()}
                expanded={isExpanded}
                onPress={this._handlePress}>
                <View>
                    <Text>שם - {`${child.firstName} ${child.lastName}`}</Text>
                    <Text>מין - {child.gender}</Text>
                    <Text>טלפון - {child.phone}</Text>
                    <Text>תאריך לידה - {child.birthDate}</Text>
                    <Text style={{ color: tinycolor(child.color).toRgbString() }}>הצבע של הילד</Text>
                    <Button onPress={this.moveToEdit}>ערוך</Button>
                </View>
            </List.Accordion>
        );
    }
}


const styles = StyleSheet.create({
    sliderRow: {
        alignSelf: 'stretch',
        marginLeft: 12,
        marginTop: 12
    },
});