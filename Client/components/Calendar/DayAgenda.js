import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

class DayAgenda extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayAgenda: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            dayAgenda: props.dayAgenda
        };
    }

    onMoveToEventDetails = (hoog) => {
        this.props.navigation.navigate('EventDetails', hoog)
    }

    render() {
        return (
            <View>
                {this.state.dayAgenda.map((hoog, i) =>
                    <TouchableOpacity key={i} onPress={() => this.onMoveToEventDetails(hoog)}>
                        <Surface style={[styles.surface, { borderRightColor: hoog.color }]} >
                            <View style={styles.line}>
                                <Text style={styles.groupName}>{hoog.name}</Text>
                            </View>
                            <View style={styles.line}>
                                <Button style={styles.hours} icon='access-time' color='rgb(110, 110, 110)'>{hoog.start_hour} - {hoog.end_hour}</Button>
                                <Button style={styles.location} icon='location-on' color='rgb(110, 110, 110)'>{hoog.location}</Button>
                            </View>
                        </Surface>
                    </TouchableOpacity >)}
            </View>
        );
    }
}

const styles = {
    surface: {
        marginTop: 15,
        marginLeft: 20,
        height: 90,
        width: 340,
        elevation: 4,
        borderRightWidth: 10,
        textColor: 'Black'
    },
    line: {
        flex: 1,
        flexDirection: 'row'
    },
    hours: {
        textAlign: 'left',
        fontSize: 14,
        marginTop: 5
    },
    location: {
        textAlign: 'left',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 5
    },
    childName: {
        borderWidth: 1,
        borderRadius: 30,
        height: 50,
        width: 50,
        marginTop: 5
    },
    groupName: {
        textAlign: 'left',
        fontSize: 18,
        marginTop: 10,
        marginLeft: 10,
        color: 'rgb(34, 34, 34)'
    },
    text: {
        textAlign: 'left'
    }
}

export default withNavigation(DayAgenda)