import React, { Component } from 'react'
import { View, StyleSheet, Picker } from "react-native";
import { Text, TextInput, RadioButton, Button } from "react-native-paper";

const Manager = "מדריך"
const Parent = "הורה"

export default class SignUpView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            gender: '',
            phone: '',
            role: Manager,
            address: '',
            email: '',
            password1: '',
            password2: ''
        }
    }

    onChangeRole = (value) => {
        console.log(value)
        this.setState(prevState => ({
            role: value,
            address: value === Manager ? '' : prevState.address
        }))
    }

    isAllFieldsFilled = () => {
        let emptyFields = Object.keys(this.state).filter(key => this.state[key] === '')
        if (emptyFields.find(key => key === "address") && this.state.role === Manager) {
            emptyFields = emptyFields.filter(key => key !== "address")
        }

        return emptyFields.length > 0
    }

    performeRegister = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { firstName, lastName, gender, phone, role, address, email, password1, password2 } = this.state
        return (
            <View>
                <View style={styles.title}>
                    <Text>הרשמה</Text>
                </View>
                <View style={styles.body}>
                    <TextInput label='שם פרטי'
                        value={firstName} onChangeText={firstName => this.setState({ firstName })} />
                    <TextInput label='שם משפחה'
                        value={lastName} onChangeText={lastName => this.setState({ lastName })} />
                    <Text>מין</Text>
                    <Picker
                        selectedValue={gender}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(gender) =>
                            this.setState({ gender })
                        }>
                        <Picker.Item label="זכר" value="male" />
                        <Picker.Item label="נקבה" value="female" />
                    </Picker>
                    <TextInput label='טלפון'
                        value={phone} onChangeText={phone => this.setState({ phone })} />
                    <RadioButton.Group onValueChange={this.onChangeRole} value={role}>
                        <View>
                            <Text>הורה</Text>
                            <RadioButton value="הורה" />
                        </View>
                        <View>
                            <Text>מדריך</Text>
                            <RadioButton value="מדריך" />
                        </View>
                    </RadioButton.Group>
                    {role === Parent &&
                        <TextInput label='כתובת'
                            value={address}
                            onChangeText={address => this.setState({ address })} />}
                    <TextInput label='אימייל'
                        value={email} onChangeText={email => this.setState({ email })} />
                    <TextInput secureTextEntry={true} label='סיסמה'
                        value={password1} onChangeText={password1 => this.setState({ password1 })} />
                    <TextInput secureTextEntry={true} label='שוב סיסמה'
                        value={password2} onChangeText={password2 => this.setState({ password2 })} />
                    <Button mode="contained" disabled={(this.isAllFieldsFilled())} onPress={this.performeRegister}>הירשם</Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
    },
    body: {
    }
})
