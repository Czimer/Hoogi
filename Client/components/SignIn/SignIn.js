import React from 'react';
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Axios from 'axios';
import appConfig from '../../appConfig';


export default class SignIn extends React.Component {
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
            AsyncStorage.setItem("loginData",JSON.stringify(res.data))
            this.props.navigation.navigate('App')
        }).catch(err => {
            console.log(err.message)
        })
    }

    navigateToSignUp = () => {
        this.props.navigation.navigate('SignUp')
    }

    render() {
        const { email, password } = this.state
        return (
            <View style={styles.container}>
                <Text >Hoogi. make a logo</Text>
                <View>
                    <TextInput label="אימייל" value={email} onChangeText={this.onEmailChange} />
                    <TextInput label="סיסמה" value={password} onChangeText={this.onPasswordChange} />
                </View>
                <View style={styles.buttons}>
                    <Button style={{ width: '50%' }} onPress={this.navigateToSignUp} >הרשם</Button>
                    <Button style={{ width: '50%' }} onPress={this.onConnect} mode="contained">התחבר</Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
    },
    buttons: {
        flexDirection: 'row'
    }
})