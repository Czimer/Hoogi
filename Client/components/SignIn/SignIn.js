import React from 'react';
import { StyleSheet, Image, View, AsyncStorage, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Axios from 'axios';
import appConfig from '../../appConfig';


export default class SignIn extends React.Component {
    static navigationOptions = {
        title: 'חוגי'
    }
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    onEmailChange = (event) => {
        this.setState({ email: event })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event })
    }

    onConnect = () => {
        const { email, password } = this.state
        const params = { email, password }
        Axios.post(`${appConfig.ServerApiUrl}/general/signIn`, params).then((res) => {
            AsyncStorage.setItem("loginData", JSON.stringify(res.data))
            this.props.navigation.navigate('App')
        }).catch(err => {
            console.log(err.message)
            Alert.alert('שגיאה בהתחברות', 'ניסינו לחבר אותך למערכת אבל לא הצלחנו, הפרטים שהזנת נכונים?')
        })
    }

    navigateToSignUp = () => {
        this.props.navigation.navigate('SignUp')
    }

    render() {
        const { email, password } = this.state
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: 250, width: 250 }} source={require('../../assets/logo.jpg')} />
                </View>
                <View style={styles.inputView}>
                    <View>
                        <TextInput label="אימייל" value={email} onChangeText={this.onEmailChange} />
                        <TextInput label="סיסמה" value={password} onChangeText={this.onPasswordChange} secureTextEntry={true} />
                    </View>
                    <View style={styles.buttons}>
                        <Button style={styles.button} onPress={this.navigateToSignUp} >הרשם</Button>
                        <Button style={styles.button} onPress={this.onConnect} mode="contained">התחבר</Button>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 15

    },
    inputView: {
        flex: 1,
        marginTop: 50
    },
    buttons: {
        flexDirection: 'row'
    },
    button: {
        width: '50%'
    }
})