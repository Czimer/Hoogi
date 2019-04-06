import React from 'react';
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";


export default class Home extends React.Component {

    navigateToFeed = () =>{
        this.props.navigation.navigate('Feed')
    }

    navigateToCalander = () =>{
        this.props.navigation.navigate('Calander')
    }

    render() {
        return (
            <View style={styles.container}>
                <Button mode="contained" onPress={this.navigateToCalander}>לוח שנה</Button>
                <Button mode="contained" onPress={this.navigateToFeed}>לוח הודעות</Button>
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