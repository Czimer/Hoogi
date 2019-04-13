import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { IconButton,TextInput } from 'react-native-paper';

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
        console.log(date)
        const { title, date, maxDate } = this.props
        return (
            <React.Fragment >
                <View style={styles.container}>
                <IconButton style={styles.Icon} icon="add-box" onPress={this._showDateTimePicker}>
                    </IconButton>
                    <TextInput style={styles.input} label={title} value={date} disabled />                    
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor:'#e7e7e7',
        borderColor: '#000',
        paddingBottom: 10,
    },
    Icon: {
    },
    input: {
        flex: 1,
    }
});