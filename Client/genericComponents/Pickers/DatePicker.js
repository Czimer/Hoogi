import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { IconButton, TextInput } from 'react-native-paper';

const DateBeforeThreeYears = new Date(new Date().setFullYear(new Date().getFullYear() - 3))

export default class DatePicker extends Component {
    state = {
        isDateTimePickerVisible: false,
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.props.onChange(new Date(date).toLocaleDateString())
        this._hideDateTimePicker();
    };

    render() {
        const { title, date, isLimited } = this.props

        console.log(date);


        const dateTimePickerProps = {
            date: new Date(date),
            isVisible: this.state.isDateTimePickerVisible,
            onConfirm: this._handleDatePicked,
            onCancel: this._hideDateTimePicker
        }

        return (
            <React.Fragment >
                <View style={styles.container}>
                    <IconButton style={styles.Icon} icon="add-box" onPress={this._showDateTimePicker}>
                    </IconButton>
                    <TextInput style={styles.input} label={title} value={date} disabled />
                </View>
                {isLimited ?
                    <DateTimePicker maximumDate={DateBeforeThreeYears} {...dateTimePickerProps} />
                    :
                    <DateTimePicker   {...dateTimePickerProps} />}
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: '#e7e7e7',
        borderColor: '#000',
        paddingBottom: 10,
    },
    Icon: {
    },
    input: {
        flex: 1,
    }
});