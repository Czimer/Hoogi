import React from 'react';
import { StyleSheet, Picker, View, ScrollView } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import DatePicker from '../../genericComponents/Pickers/DatePicker';
import appConfig from '../../appConfig';
import { HueSlider } from "react-native-color";
import tinycolor from 'tinycolor2';

export default class ChildDetailsComponent extends React.Component {
    constructor(props) {
        super(props);
        let childObj = { ...defaultValue }
        console.log(this.props.navigation.state.params)
        if (Object.keys(this.props.navigation.state.params.child).length) {
            const { child } = this.props.navigation.state.params
            childObj = { ...child, color: tinycolor(child.color).toHsl() }
        }

        this.state = {
            ...childObj
        };
    }

    saveOrUpdate = async () => {
        const { childId, firstName, lastName, gender, phone, birthDate, color } = this.state
        const errorObject = {
            childIdError: undefined,
            firstNameError: undefined,
            lastNameError: undefined,
            phoneError: undefined,
            birthDateError: undefined
        }
        let isError = false

        if (childId.trim() === '' || childId.trim().length < 2) {
            isError = true
            errorObject.childIdError = 'תעודת זהות לא תקינה'
        }

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

        if (!birthDate) {
            isError = true
            errorObject.birthDateError = 'יש להזין תאריך לידה'
        }

        this.setState({ ...errorObject })
        if (!isError) {
            const child = { childId, firstName, lastName, gender, phone, birthDate, color: tinycolor(color).toRgbString() }
            await this.props.navigation.state.params.onAction(child)
            this.props.navigation.goBack()
        }
    }

    render() {
        const { id, childId, firstName, lastName, gender, phone, birthDate, color } = this.state
        return (
            <ScrollView>
                <View style={{ flex: 1, padding: 15 }}>
                    {!id && <TextInput label='תעודת זהות'
                        value={childId} onChangeText={childId => this.setState({ childId })} />}
                    {!!this.state.childIdError && <HelperText type="error">{this.state.childIdError}</HelperText>}
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
                        <Picker.Item label="זכר" value="זכר" />
                        <Picker.Item label="נקבה" value="נקבה" />
                    </Picker>
                    <TextInput label='טלפון'
                        value={phone} onChangeText={phone => this.setState({ phone })} />
                    {!!this.state.phoneError && <HelperText type="error">{this.state.phoneError}</HelperText>}
                    <DatePicker title={'הזן תאריך לידה'} date={birthDate} isLimited onChange={birthDate => this.setState({ birthDate })}></DatePicker>
                    {!!this.state.birthDateError && <HelperText type="error">יש לבחור תאריך לידה</HelperText>}
                    <HueSlider
                        style={styles.sliderRow}
                        gradientSteps={40}
                        value={color.h}
                        onValueChange={h => this.setState({ color: { ...this.state.color, h } })}
                    />
                    <Button mode="contained" onPress={this.saveOrUpdate}>{id ? 'ערוך' : 'הוסף'}</Button>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
    },
    sliderRow: {
        alignSelf: 'stretch',
        marginLeft: 12,
        marginTop: 12
    },
});

const defaultValue = {
    childId: '',
    firstName: '',
    lastName: '',
    gender: 'זכר',
    phone: '',
    birthDate: undefined,
    color: tinycolor('red').toHsl()
}