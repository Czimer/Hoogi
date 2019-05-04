import React from 'react';
import { List, Avatar, Text, Button, TextInput } from "react-native-paper";
import { View , Picker} from "react-native";
import DatePicker from "../../genericComponents/Pickers/DatePicker";

export default class Child extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            isEditMode: false,
            child: this.props.child
        };
    }

    _handlePress = () =>
        this.setState({
            isExpanded: !this.state.isExpanded
        });


    // TODO: when i can show photo, show it!
    renderAvatar = () => {
        const { child } = this.props
        return <Avatar.Text size={36} label={`${child.firstName[0]}${child.lastName[0]}`} />
    }

    onSaveChildNewData = () => {
        const { firstName, lastName, phone} = this.state.child
        const errorObject = {
            firstNameError: undefined,
            lastNameError: undefined,
            phoneError: undefined,
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

        if (isError) {
            this.setState({...errorObject})
        } else{
            // some api call
            this.props.onEditChild(this.state.child)
            this.setState({ isEditMode: false })
        }
        
    }

    cancelEdit = () => {
        this.setState({ child: this.props.child, isEditMode: false })
    }

    render() {
        const { isExpanded, isEditMode, child } = this.state
        return (
            <List.Accordion
                title={`${child.firstName} ${child.lastName}`}
                left={() => this.renderAvatar()}
                expanded={isExpanded}
                onPress={this._handlePress}>
                {/* {isEditMode ?
                    <View>
                        <TextInput label='שם פרטי'
                            value={child.firstName} onChangeText={firstName => this.setState(prevState => ({ child: { ...prevState.child, firstName } }))} />
                             {!!this.state.firstNameError && <HelperText type="error">{this.state.firstNameError}</HelperText>}
                        <TextInput label='שם משפחה'
                            value={child.lastName} onChangeText={lastName => this.setState(prevState => ({ child: { ...prevState.child, lastName } }))} />
                            {!!this.state.lastNameError && <HelperText type="error">{this.state.lastNameError}</HelperText>}
                        <Text>מין</Text>
                        <Picker
                            selectedValue={child.gender}
                            style={{ height: 50, width: 100 }}
                            onValueChange={(gender) =>
                                this.setState(prevState => ({ child: { ...prevState.child, gender } }))
                            }>
                            <Picker.Item label="זכר" value="זכר" />
                            <Picker.Item label="נקבה" value="נקבה" />
                        </Picker>
                        <TextInput label='טלפון'
                            value={child.phone} onChangeText={phone => this.setState(prevState => ({ child: { ...prevState.child, phone } }))} />
                             {!!this.state.phoneError && <HelperText type="error">{this.state.phoneError}</HelperText>}
                        <DatePicker title={'הזן תאריך לידה'} date={child.birthDate} isLimited onChange={birthDate => this.setState(prevState => ({ child: { ...prevState.child, birthDate } }))}></DatePicker>
                        <Button onPress={this.onSaveChildNewData}>שמור</Button>
                        <Button onPress={this.cancelEdit}>ביטול</Button>
                    </View> : */}
                    <View>
                        <Text>שם - {`${child.firstName} ${child.lastName}`}</Text>
                        <Text>מין - {child.gender}</Text>
                        <Text>טלפון - {child.phone}</Text>
                        <Text>תאריך לידה - {child.birthDate}</Text>
                        {/* <Button onPress={() => this.setState({ isEditMode: true })}>ערוך</Button> */}
                    </View>
                {/* } */}
            </List.Accordion>
        );
    }
}