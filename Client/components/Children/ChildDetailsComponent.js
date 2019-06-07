import React from 'react';
import { TouchableHighlight, Picker, View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import DatePicker from '../../genericComponents/Pickers/DatePicker';
import appConfig from '../../appConfig';
import { HueSlider } from "react-native-color";
import tinycolor from 'tinycolor2';
import { ImageBrowser } from 'expo-multiple-imagepicker';

export default class ChildDetailsComponent extends React.Component {
    static navigationOptions = {
        title: 'פרטי הילד'
    }
    constructor(props) {
        super(props);
        let childObj = { ...defaultValue }
        console.log(this.props.navigation.state.params)
        if (Object.keys(this.props.navigation.state.params.child).length) {
            const { child } = this.props.navigation.state.params
            childObj = { ...child, color: tinycolor(child.color).toHsl() }
        }

        this.state = {
            imageBrowserOpen: false,
            ...childObj
        };
    }

    saveOrUpdate = async () => {
        const { childId, firstName, lastName, gender, phone, birthDate, color, photo } = this.state
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
            const child = { childId, firstName, lastName, gender, phone, birthDate, color: tinycolor(color).toRgbString(), photo }
            await this.props.navigation.state.params.onAction(child)
            this.props.navigation.goBack()
        }
    }

    openImageBrowser = async () => {
        const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (perm.status === 'granted') {
            this.setState({ imageBrowserOpen: true })
        }
    }

    imageBrowserCallback = (callback) => {
        callback.then((photo) => {
            console.log(photo)
            this.setState({
                imageBrowserOpen: false,
                photo: photo[0]
            })
        }).catch((e) => console.log(e))
    }

    render() {
        const { id, childId, firstName, lastName, gender, phone, birthDate, color, photo, imageBrowserOpen } = this.state

        if (imageBrowserOpen) return <ImageBrowser max={1} callback={this.imageBrowserCallback} />
        console.log(photo)
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

                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}>
                        <Text>התמונה של הילד</Text>
                        <TouchableHighlight onPress={this.openImageBrowser}>
                            {photo && photo.uri ? <Image style={{ width: 150, height: 150 }} source={{ uri: photo.uri }} /> :
                                <Image style={{ height: 150, width: 150 }} source={require('../../assets/empty-man.png')} />}
                        </TouchableHighlight>
                    </View>
                    <Button mode="contained" onPress={this.saveOrUpdate}>{id ? 'ערוך' : 'הוסף'}</Button>
                </View>
            </ScrollView>
        );
    }
}

//gender === 'male' ? '../../assets/empty-man.png' :

const styles = StyleSheet.create({
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