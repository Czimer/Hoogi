import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet,AsyncStorage } from "react-native";
import { Manager } from '../../consts';

export default class EventDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hoog: this.props.navigation.state.params,
            isEditMode: false,
            isManager:false
        }        
    }

    async componentDidMount(){
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager

        if(isManager) this.setState({isManagerMode:isManager})
    }

    onEdit = () => {this.props.navigation.navigate('Event')};
    onEditMode = () => this.setState({ isEditMode: true })
    onCloseEditMode = () => this.setState({ isEditMode: false })

    render() {
        const { hoog, isEditMode } = this.state
        return (
            <View style={styles.container}>
                <View >
                    <Text>{hoog.group_name}</Text>
                    <Button style={styles.line} icon='event' color='rgb(110, 110, 110)'>{hoog.date}</Button>
                    <Button style={styles.line} icon='access-time' color='rgb(110, 110, 110)'>{hoog.start_time} - {hoog.end_time}</Button>
                    <Button style={styles.line} icon='location-on' color='rgb(110, 110, 110)'>{hoog.location}</Button>
                </View>
                <View style={styles.chips}>
                    <Button icon='card-travel' color='rgb(110, 110, 110)'></Button>
                    <View style={styles.chips}>
                        {hoog.equipment ? hoog.equipment.map((equip, i) => {
                            return <Chip style={styles.chip} key={i}>{equip}</Chip>
                        }) : `ללא ציוד מיוחד`}
                    </View>
                </View>
                <Button style={styles.line} icon='description' color='rgb(110, 110, 110)'>
                    <Text>{hoog.notes ? hoog.notes : 'אין תיעוד'}</Text>
                </Button>
                { (true && isEditMode) && <FAB icon="edit" onPress={this.onEditMode} style={styles.fab} />}
                <Button onPress={this.onEdit}>ערוך</Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:15,
        backgroundColor: '#fff',
        direction: 'rtl'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    chips: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        paddingHorizontal: 12,
        fontSize: 14,
        marginLeft: 5,
        marginTop: 5
    },
    chip: {
        height: 35,
        margin: 4
    },
    line: {
        fontSize: 14,
        marginTop: 5
    }
});