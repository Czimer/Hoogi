import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet, Image } from "react-native";
import { Manager } from '../../consts';
import appConfig from '../../appConfig';
let logo = require('../../assets/logo.jpg');

export default class EventDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {title: 'אירוע'}
    }
    
    constructor(props) {
        super(props);

        this.state = {
            hoog: this.props.navigation.state.params,
            isManager: this.props.navigation.state.params.isManager
        }        
    }

    async componentDidMount() {
    }

    onEdit = (hoog) => {
        this.props.navigation.navigate('Event', hoog);
    };
    onCloseEditMode = () => this.setState({ isEditMode: false })

    render() {
        const { hoog, isManager } = this.state
        const hoogDate = new Date(hoog.date);

        return (
            <View style={styles.container}>
                <View style={styles.image}>
                    <Image style={{ height: 200, width: 200 }} source={logo} />
                </View>
                <View >
                    <Text style={styles.title}>{hoog.group_name}</Text>
                    <Button style={styles.line} icon='event' color='rgb(110, 110, 110)'>{`יום ${appConfig.hebCalendar.dayNamesShort[hoogDate.getDay()]}, ${hoogDate.getDate()} ב${appConfig.hebCalendar.monthNames[hoogDate.getMonth()]}`}</Button>
                    <Button style={styles.line} icon='access-time' color='rgb(110, 110, 110)'>{hoog.start_time} - {hoog.end_time}</Button>
                    <Button style={styles.line} icon='location-on' color='rgb(110, 110, 110)'>{hoog.location}</Button>
                </View>
                <View style={styles.chips}>
                    <View style={styles.chips}>
                        {hoog.equipment ? hoog.equipment.map((equip, i) => {
                            return <Chip style={styles.chip} key={i}>{equip}</Chip>
                        }) : `ללא ציוד מיוחד`}
                    </View>
                </View>
                <Text style={styles.description}>{hoog.description ? hoog.description : 'אין תיעוד'}</Text>
                { isManager ? <Button style={styles.editBut} onPress={() => this.onEdit(hoog)}>
                                <Text style={styles.editTxt}>ערוך</Text>
                              </Button> : null}
                
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
    image: {
        alignItems: 'center'
    },
    title: {
        marginTop: 5,
        fontSize: 22,
        marginLeft: 5
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
        marginTop: 5,
        textAlign: 'right',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    chip: {
        height: 35,
        margin: 4,
        fontSize: 16,
        backgroundColor: '#bbbbbb'
    },
    line: {
        fontSize: 16,
        marginTop: 5,
        textAlign: 'right',
        flexDirection: 'row',
    },
    description: {
        fontSize: 14,
        marginTop: 10,
        height: 100,
        flexDirection: 'row',
        width: 350,
        justifyContent: 'flex-start',
        marginLeft: 20
    },
    editBut: {
        backgroundColor: '#fae782',
        marginTop: 5
    },
    editTxt: {
        color: '#517a8b'
    }
});