import React from 'react';
import { Text, TextInput, Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";


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

    navigateToSignUp = () => {
        console.log(this.state.email)
        console.log(this.state.password)
        // this.props.navigate('SignUp')
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
                    <Button style={{ width: '50%' }} onPress={this.navigateToSignUp}>הרשם</Button>
                    <Button style={{ width: '50%' }}  mode="contained">התחבר</Button>
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