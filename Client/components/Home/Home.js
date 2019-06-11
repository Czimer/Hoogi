import React, { Fragment } from 'react';
import { StyleSheet, View, AsyncStorage } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { Manager } from '../../consts';
import TouchIcon from "./TouchIcon";
import PushNotificationService from '../../helpers/PushNotificationService';

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
        //const token = await PushNotificationService.registerForPushNotificationsAsync()
        // if (token) {
        //     loginData.token = token
        //     await AsyncStorage.setItem("loginData", JSON.stringify(loginData))
        // }
    }

    getParentOptions=()=>{
        const options=[]
        options.push({text:'לוח שנה',image:require('../../assets/calendar.jpg'),navigateFunc:this.navigateToCalendar})
        options.push({text:'לוח הודעות',image:require('../../assets/feed.png'),navigateFunc:this.navigateToFeed})
        options.push({text:'חיפוש',image:require('../../assets/search.png'),navigateFunc:this.navigateToSearch})
        options.push({text:'הילדים שלי',image:require('../../assets/childs.jpg'),navigateFunc:this.navigateToChildren})
        options.push({text:'הגדרות',image:require('../../assets/settings.png'),navigateFunc:this.navigateToSettings})
        
        return options
    }

    getManagerOptions=()=>{
        const options=[]
        options.push({text:'לוח שנה',image:require('../../assets/calendar.jpg'),navigateFunc:this.navigateToCalendar})
        options.push({text:'לוח הודעות',image:require('../../assets/feed.png'),navigateFunc:this.navigateToFeed})
        options.push({text:'הקבוצות שלי',image:require('../../assets/group.jpg'),navigateFunc:this.navigateToGroupList})
        options.push({text:'החוגים שלי',image:require('../../assets/trophy.png'),navigateFunc:this.navigateToHoogList})
        
        return options
    }

    navigateToFeed = () => this.props.navigation.navigate('Feed')
    navigateToCalendar = () => this.props.navigation.navigate('Calendar')
    navigateToSearch = () => this.props.navigation.navigate('HoogSearch')
    navigateToChildren = () => this.props.navigation.navigate('MyChildren')
    navigateToContactsList = () => this.props.navigation.navigate('ContactsList')
    navigateToGroupList = () => this.props.navigation.navigate('GroupList')
    navigateToSettings = () => this.props.navigation.navigate('Settings')
    navigateToHoogList = () => this.props.navigation.navigate('HoogsList')

    render() {
        const { showSpin, ManagerMode } = this.state
        return (

            <View style={styles.container}>
                {showSpin ? <ActivityIndicator animating={true} size="large" /> :
                    <View style={styles.options}>
                        {ManagerMode ?
                            <Fragment>
                                {this.getManagerOptions().map((option,index)=>{
                                    return <TouchIcon key={index} text={option.text} image={option.image} onPress={option.navigateFunc} />
                                })}
                            </Fragment> :
                            <Fragment>
                                {this.getParentOptions().map((option,index)=>{
                                    return <TouchIcon key={index} text={option.text} image={option.image} onPress={option.navigateFunc} />
                                })}
                            </Fragment>
                        }
                    </View>}
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10
    },
    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    }
})