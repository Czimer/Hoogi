
import React from 'react';
import { AsyncStorage, StyleSheet, Text, ScrollView, View } from 'react-native';
import { Headline, Divider, Checkbox, ActivityIndicator } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';
import axios from 'axios';
import appConfig from '../../appConfig';


export default class Settings extends React.Component {
    state = {
        settings: [],
        families: [],
        showSpin: true
    }

    handlePress = i => {
        const settingId = this.state.settings[i].id;
        const is_active_new = !this.state.settings[i].is_active;

        this.setState(state => {
            console.log(state);

            const newSettingsArray = state.settings.map((item, j) => {
                if (j === i) {
                    item.is_active = !item.is_active;
                    return item;
                }
                else {
                    return item;
                }
            });

            const newSettings = { 
                settings: newSettingsArray 
            }; 

            console.log(newSettings);
            return (newSettings);
        });

        axios.post(`${appConfig.ServerApiUrl}/settings/update`, {id: settingId, is_active: is_active_new}).then(response => { 
            console.log("update succeffuly");   
        }).catch(error => {
            console.log(error);
            alert("Server error - can't update settings")
        });
    }

    async componentWillMount() {
        const loginData = await AsyncStorage.getItem('loginData');
        const parentId = JSON.parse(loginData).id;
        axios.post(`${appConfig.ServerApiUrl}/settings/parent`, {parentId: parentId}).then(response => { 
            console.log(response.data);
            this.setState({
                settings: response.data,
                families: [...new Set(response.data.map(sett => sett.family_name))],
                showSpin: false
            });
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { settings, families, showSpin } = this.state;

        return (
            <ScrollView style={styles.mainView}>
                {showSpin ? <ActivityIndicator animating={true} size="large" /> : 
                families.map((fam, i) => {
                    return (
                        <View key={i}>
                            <Headline style={styles.notifiHeadline}>{fam}</Headline>
                            <View style={styles.section}>
                                {settings.map((sett, j) => { 
                                    return (
                                        <View key={j} style={styles.sett}> 
                                            <View style={styles.text}>
                                                <Text>{sett.text}</Text>
                                            </View>
                                            <View style={sett.switch}>
                                                <Switch value={sett.is_active} onValueChange={() => this.handlePress(j)}/>
                                            </View>
                                            <Divider/>
                                        </View>
                                    )}
                                )}
                            </View>
                        </View>
                    )}
                )}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        width: '90%',
        marginLeft: '5%'
    },
    notifiHeadline: {
        marginTop: 30
    },
    section: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 8
    },
    sett: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    switch: {
         display: 'flex',
         flex: 1,
         flexDirection: 'column',
         justifyContent: 'flex-end',
         alignContent: 'flex-end',
         alignItems: 'flex-end',
         marginRight: 5
    },
    text: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 5
   }
});