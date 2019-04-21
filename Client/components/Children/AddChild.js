import React from 'react';
import { StyleSheet, Picker } from "react-native";
import { Text, TextInput, Modal, Portal, Card, Button, HelperText } from "react-native-paper";
import DatePicker from '../../genericComponents/Pickers/DatePicker';

export default class AddChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            gender: 'זכר',
            phone: '',
            birthDate: undefined,
        };
    }

    addNew = () => {
        const { firstName, lastName, gender, phone, birthDate } = this.state
        const errorObject = {
            firstNameError: undefined,
            lastNameError: undefined,
            phoneError: undefined,
            birthDateError: undefined
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
        if (!(new RegExp("^[0-9]{10}$").test(phone))) {
            isError = true
            errorObject.phoneError = 'טלפון לא חוקי'
        }

        if (!birthDate) {
            isError = true
            errorObject.birthDateError = 'יש להזין תאריך לידה'
        }

        if (isError) {
            this.setState({ ...errorObject })
        } else {
            const child = { firstName, lastName, gender, phone, birthDate }
            this.props.onAccept(child)
        }
    }

    render() {
        const { onClose } = this.props
        const { firstName, lastName, gender, phone, birthDate } = this.state
        return (
            <Portal>
                <Modal visible={true} onDismiss={onClose} contentContainerStyle={styles.modal}>
                    <Card>
                        <Card.Content>
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
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained" onPress={this.addNew}>הוסף</Button>
                            <Button style={{ marginLeft: 10 }} onPress={onClose}>בטל</Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
    }
});