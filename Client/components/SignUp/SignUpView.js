import React, { Component } from 'react'
import { View, StyleSheet, Picker,ScrollView } from "react-native";
import { Text, TextInput, RadioButton, Button, HelperText } from "react-native-paper";
import appConfig from '../../appConfig';

const Manager = "מדריך"

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

    performeRegister = () => {
        const { firstName, lastName, address, email, phone, password1, password2 } = this.state
        const errorObject = {
            firstNameError: undefined,
            lastNameError: undefined,
            phoneError: undefined,
            addressError: undefined,
            emailError: undefined,
            passwordError: undefined
        }

        let isError = false

        if (firstName.trim() === '' || firstName.trim().length < 2) {
            isError = true
            errorObject.firstNameError = 'שם פרטי לא יכול להיות ריק או קטן מ2 אותיות'
        }
        if (lastName.trim() === '' || lastName.trim().length < 2) {
            isError = true
            errorObject.lastNameError = 'שם משפחה לא יכול להיות ריק או קטן מ2 אותיות'
        }
        if (!appConfig.regex.phone.test(phone)) {
            isError = true
            errorObject.phoneError = 'טלפון לא חוקי'
        }

        if (address.trim() === '') {
            isError = true
            errorObject.addressError = 'כתובת לא יכולה להיות ריקה'
        }

        if (!appConfig.regex.email.test(email)) {
            isError = true
            errorObject.emailError = 'אימייל לא חוקי'
        }

        if (password1.trim() === '' || password2.trim() === '') {
            isError = true
            errorObject.passwordError = 'סיסמה לא יכולה להיות ריקה'
        }
        else if (password1 != password2) {
            isError = true
            errorObject.passwordError = 'הסיסמאות לא תואמות'
        }

        if (isError) {
            this.setState({ ...errorObject })
        } else {
            // api call and then go back
            this.props.navigation.goBack()
        }

    }

    render() {
        const { firstName, lastName, gender, phone, role, address, email, password1, password2 } = this.state
        return (
            <ScrollView>
                <View style={{ flex: 1, padding: 15 }}>
                    <View style={styles.title}>
                        <Text>הרשמה</Text>
                    </View>
                    <View style={styles.body}>
                        <TextInput label='שם פרטי'
                            value={firstName} onChangeText={firstName => this.setState({ firstName })} />
                        {!!this.state.firstNameError && <HelperText type="error">{this.state.firstNameError}</HelperText>}
                        <TextInput label='שם משפחה'
                            value={lastName} onChangeText={lastName => this.setState({ lastName })} />
                        {!!this.state.lastNameError && <HelperText type="error">{this.state.lastNameError}</HelperText>}
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
                        {!!this.state.phoneError && <HelperText type="error">{this.state.phoneError}</HelperText>}
                        <RadioButton.Group onValueChange={role => this.setState({ role })} value={role}>
                            <View style={style = { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 }}>
                                <View>
                                    <Text>הורה</Text>
                                    <RadioButton value="הורה" />
                                </View>
                                <View>
                                    <Text>מדריך</Text>
                                    <RadioButton value="מדריך" />
                                </View>
                            </View>
                        </RadioButton.Group>
                        <TextInput label='כתובת'
                            value={address}
                            onChangeText={address => this.setState({ address })} />
                        {!!this.state.addressError && <HelperText type="error">{this.state.addressError}</HelperText>}
                        <TextInput label='אימייל'
                            value={email} onChangeText={email => this.setState({ email })} />
                        {!!this.state.emailError && <HelperText type="error">{this.state.emailError}</HelperText>}
                        <TextInput secureTextEntry={true} label='סיסמה'
                            value={password1} onChangeText={password1 => this.setState({ password1 })} />
                        <TextInput secureTextEntry={true} label='שוב סיסמה'
                            value={password2} onChangeText={password2 => this.setState({ password2 })} />
                        {!!this.state.passwordError && <HelperText type="error">{this.state.passwordError}</HelperText>}
                        <Button mode="contained" onPress={this.performeRegister}>הירשם</Button>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
    },
    body: {
    }
})
