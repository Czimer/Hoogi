import React, { Component } from 'react'
import { View, StyleSheet, Picker, ScrollView } from "react-native";
import { Text, TextInput, RadioButton, Button, HelperText } from "react-native-paper";
import appConfig from '../../appConfig';
import Axios from 'axios';
import { Manager } from '../../consts';

export default class SignUpView extends Component {
    static navigationOptions = {
        title: 'הרשמה'
    }
    constructor(props) {
        super(props)
        this.state = {
            personalId: '',
            firstName: '',
            lastName: '',
            gender: 'male',
            phone: '',
            role: Manager,
            email: '',
            password1: '',
            password2: ''
        }
    }

    performeRegister = () => {
        const { personalId, firstName, lastName, email, phone, password1, password2, role, gender } = this.state
        const errorObject = {
            personalIdError: undefined,
            firstNameError: undefined,
            lastNameError: undefined,
            phoneError: undefined,
            emailError: undefined,
            passwordError: undefined
        }

        let isError = false

        if (personalId.trim() === '' || personalId.trim().length < 2) {
            isError = true
            errorObject.personalIdError = 'תעודת זהות לא תקינה'
        }

        if (firstName.trim() === '' || firstName.trim().length < 2) {
            isError = true
            errorObject.firstNameError = 'שם פרטי לא יכול להיות ריק או קטן מ2 אותיות'
        }
        if (lastName.trim() === '' || lastName.trim().length < 2) {
            isError = true
            errorObject.lastNameError = 'שם משפחה לא יכול להיות ריק או קטן מ2 אותיות'
        }

        console.log(phone)
        console.log(appConfig.regex.phone.test(phone))
        if (!appConfig.regex.phone.test(phone)) {
            isError = true
            errorObject.phoneError = 'טלפון לא חוקי'
        }

        console.log(email)
        console.log(appConfig.regex.email.test(email))
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

        this.setState({ ...errorObject })
        if (!isError) {

            const params = {
                personalId, firstName, lastName, email, phone, password: password1, role, gender
            }
            Axios.post(`${appConfig.ServerApiUrl}/general/signUp`, params).then(() => {
                this.props.navigation.goBack()
            }).catch(err => {
                console.log(err.message)
            })
        }

    }

    render() {
        const { personalId, firstName, lastName, gender, phone, role, email, password1, password2 } = this.state
        return (
            <ScrollView>
                <View style={{ flex: 1, padding: 15 }}>
                    <View style={styles.body}>
                        <TextInput label='תעודת זהות'
                            value={personalId} onChangeText={personalId => this.setState({ personalId })} />
                        {!!this.state.personalIdError && <HelperText type="error">{this.state.personalIdError}</HelperText>}
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
