import React from 'react';
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";


export default class Home extends React.Component {

    navigateToFeed = () => {
        this.props.navigation.navigate('Feed')
    }

    navigateToCalendar = () => {
        this.props.navigation.navigate('Calendar')
    }

    navigateToSearch = () => {
        this.props.navigation.navigate('HoogSearch')
    }

    navigateToChildren = () => {
        this.props.navigation.navigate('MyChildren')
    }

    navigateToContactsList = () =>{
        this.props.navigation.navigate('ContactsList')
    }
    navigateToGroupList = () =>{
        this.props.navigation.navigate('GroupList')
    }

    render() {
        return (
            <View style={styles.container}>
                <Button mode="contained" onPress={this.navigateToCalendar}>לוח שנה</Button>
                <Button mode="contained" onPress={this.navigateToFeed}>לוח הודעות</Button>
                <Button mode="contained" onPress={this.navigateToSearch}>חיפוש</Button>
                <Button mode="contained" onPress={this.navigateToChildren}>הילדים שלי</Button>
                <Button mode="contained" onPress={this.navigateToContactsList}>רשימת משתתפים</Button>
                <Button mode="contained" onPress={this.navigateToGroupList}>רשימת קבוצות</Button>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})