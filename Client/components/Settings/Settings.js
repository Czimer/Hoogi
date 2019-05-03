
import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Headline, Divider, Checkbox } from 'react-native-paper';
import { Switch } from 'react-native-gesture-handler';

let userNotifiSettings = [{ name: "תזכורות לחוגים", checked: true },
                          { name: "שינוי במועד/מיקום חוג", checked: false }];


export default class Settings extends React.Component {
    state = {
        settings: userNotifiSettings
    }

    handlePress = i => {
        this.setState(state => {
            console.log(state);

            const newSettingsArray = state.settings.map((item, j) => {
                if (j === i) {
                    item.checked = !item.checked;
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
        })

        // TODO: Save settings
    }

    render() {
        const { settings } = this.state;

        return (
            <ScrollView style={styles.mainView}>
                <Headline style={styles.notifiHeadline}>התראות</Headline>
                <View style={styles.section}>
                    {settings.map((notifi, i) => { 
                        return (
                            <View key={i} style={styles.notifi}> 
                                <View style={styles.text}>
                                    <Text>{notifi.name}</Text>
                                </View>
                                <View style={styles.switch}>
                                    <Switch value={notifi.checked} onValueChange={() => this.handlePress(i)}/>
                                </View>
                                <Divider/>
                            </View>
                        )}
                    )}
                </View>
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
    notifi: {
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