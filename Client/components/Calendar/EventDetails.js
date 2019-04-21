import React from 'react';
import { Text, Chip, FAB, Button } from 'react-native-paper';
import { View, StyleSheet } from "react-native";

export default class EventDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hoog: this.props.navigation.state.params,
            isEditMode: false
        }
        
    }

    onEditMode = () => this.setState({ isEditMode: true })
    onCloseEditMode = () => this.setState({ isEditMode: false })

    render() {
        const { hoog, isEditMode } = this.state
        return (
            <View style={styles.container}>
                <View >
                    <Text>שם החוג - {hoog.name}</Text>
                    <Text>תאריך - {hoog.date}</Text>
                    <Text>זמן התחלה - {hoog.start_hour}</Text>
                    <Text>זמן סיום - {hoog.end_hour}</Text>
                    <Text>מיקום - {hoog.location}</Text>
                </View>
                <View >
                    <Text>ציוד</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 }}>
                        {hoog.equipment.map((equip, i) => {
                            return <Chip style={styles.chip} key={i}>{equip}</Chip>
                        })}
                    </View>
                </View>
                <View >
                    <Text>מה היה היום - {hoog.notes}</Text>
                </View>
                {//Todo: check if this is a parent or manager view
                    (true && isEditMode) && <FAB icon="edit" onPress={this.onEditMode} style={styles.fab} />}

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
    chip: {
        height: 35,
        margin: 4
    }
});