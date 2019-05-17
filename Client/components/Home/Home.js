import React, { Fragment } from 'react';
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Button, ActivityIndicator, IconButton } from "react-native-paper";
import { Manager } from '../../consts';

export default class Home extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'דף הבית',
            headerRight: (
                <IconButton
                    icon="exit-to-app"
                    size={20}
                    onPress={navigation.getParam('logoff')}
                />
            ),
        }
    }
    state = {
        showSpin: true,
        ManagerMode: true
    }

    logoff = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('AuthLoading')
    }

    async componentDidMount() {
        this.props.navigation.setParams({ logoff: this.logoff });
        const loginData = await AsyncStorage.getItem('loginData')
        const isManager = JSON.parse(loginData).user_type === Manager
        this.setState({ showSpin: false, ManagerMode: isManager })
    }

    navigateToFeed = () => this.props.navigation.navigate('Feed')
    navigateToCalendar = () => this.props.navigation.navigate('Calendar')
    navigateToSearch = () => this.props.navigation.navigate('HoogSearch')
    navigateToChildren = () => this.props.navigation.navigate('MyChildren')
    navigateToContactsList = () => this.props.navigation.navigate('ContactsList')
    navigateToGroupList = () => this.props.navigation.navigate('GroupList')
    navigateToSettings = () => this.props.navigation.navigate('Settings')

    render() {
        const { showSpin, ManagerMode } = this.state
        return (

            <View style={styles.container}>
                {showSpin ? <ActivityIndicator animating={true} size="large" /> :
                    ManagerMode ?
                        <Fragment>
                            <Button mode="contained" onPress={this.navigateToCalendar}>לוח שנה</Button>
                            <Button mode="contained" onPress={this.navigateToFeed}>לוח הודעות</Button>
                            <Button mode="contained" onPress={this.navigateToContactsList}>רשימת משתתפים</Button>
                            <Button mode="contained" onPress={this.navigateToGroupList}>רשימת קבוצות</Button>
                        </Fragment> :
                        <Fragment>
                            <Button mode="contained" onPress={this.navigateToCalendar}>לוח שנה</Button>
                            <Button mode="contained" onPress={this.navigateToFeed}>לוח הודעות</Button>
                            <Button mode="contained" onPress={this.navigateToSearch}>חיפוש</Button>
                            <Button mode="contained" onPress={this.navigateToChildren}>הילדים שלי</Button>
                            <Button mode="contained" onPress={this.navigateToContactsList}>רשימת משתתפים</Button>
                            <Button mode="contained" onPress={this.navigateToSettings}>הגדרות</Button>
                        </Fragment>
                }
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