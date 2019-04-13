import React from 'react';
import { List, Avatar, Text, Button,TextInput } from "react-native-paper";
import { View } from "react-native";

export default class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            isEditMode: false,
            child: this.props.child
        };
    }

    _handlePress = () =>
        this.setState({
            isExpanded: !this.state.isExpanded
        });


    // TODO: when i can show photo, show it!
    renderAvatar = () => {
        const { child } = this.props
        return <Avatar.Text size={36} label={`${child.firstName[0]}${child.lastName[0]}`} />
    }

    onSaveChildNewData = () => {
        // some api call
        this.props.onEditChild(this.state.child)
        this.setState({ isEditMode: false })
    }

    cancelEdit = () => {
        this.setState({ child: this.props.child, isEditMode: false })
    }

    render() {
        const { isExpanded, isEditMode, child } = this.state
        return (
            <List.Accordion
                title={`${child.firstName} ${child.lastName}`}
                left={() => this.renderAvatar()}
                expanded={isExpanded}
                onPress={this._handlePress}>
                {isEditMode ?
                    <View>
                        <TextInput label='שם פרטי'
                            value={child.firstName} onChangeText={firstName => this.setState(prevState => ({ child: { ...prevState.child, firstName } }))} />
                        <TextInput label='שם משפחה'
                            value={child.lastName} onChangeText={lastName => this.setState(prevState => ({ child: { ...prevState.child, lastName } }))} />
                        <Button onPress={this.onSaveChildNewData}>שמור</Button>
                        <Button onPress={this.cancelEdit}>ביטול</Button>
                    </View> :
                    <View>
                        <Text>שם - {`${child.firstName} ${child.lastName}`}</Text>
                        <Text>מין - {child.gender}</Text>
                        <Text>טלפון - {child.phone}</Text>
                        <Text>תאריך לידה - {child.birthDate}</Text>
                        <Button onPress={() => this.setState({ isEditMode: true })}>ערוך</Button>
                    </View>
            }
            </List.Accordion>
        );
    }
}