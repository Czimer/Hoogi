import React from 'react';
import { StyleSheet, Picker } from "react-native";
import { Text, TextInput, Modal, Portal, Card, Button } from "react-native-paper";
import DatePicker from '../../genericComponents/DatePicker';

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
        const child = { ...this.state }
        this.props.onAccept(child)
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
                            <TextInput label='שם משפחה'
                                value={lastName} onChangeText={lastName => this.setState({ lastName })} />
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
                            <DatePicker title={'הזן תאריך לידה'} date={birthDate} onChange={birthDate => this.setState({ birthDate })}></DatePicker>
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