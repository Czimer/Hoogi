import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import { Card, HelperText } from 'react-native-paper';


export default class GenericList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    };

    render() {
        const { tableHead, tableData, handleLongPress, children } = this.props;
        return (
            <>
                <ScrollView>
                    {(tableData !== undefined) && tableData.map((row, rowIndex) => {
                        return (
                            <Card style={styles.container} key={rowIndex}>
                                <Card.Content>
                                    <TouchableHighlight key={rowIndex} onLongPress={(event) => handleLongPress(event, row)}>
                                        <View>
                                            {
                                                Object.keys(row).map((keyName, cellRowIndex) => {
                                                    if (row[keyName] instanceof Array) {
                                                        row[keyName] = row[keyName].join(', ')
                                                    }
                                                    return (
                                                        <Text key={`${rowIndex} - ${cellRowIndex}`}>
                                                            {tableHead[cellRowIndex]} :  {row[keyName]}
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </View>
                                    </TouchableHighlight>
                                </Card.Content>
                            </Card>
                        );
                    })}
                </ScrollView>

                {children}
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: { borderRadius: 3, borderColor: '#9ED3F7', borderWidth: 1, backgroundColor: '#EEF8FF', margin: 8, marginBottom: 0 },
});


