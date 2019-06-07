import React from 'react';
import { Image, StyleSheet, View, ListView } from "react-native";
import appConfig from '../../appConfig';
import { Portal, Modal, Card, Title } from 'react-native-paper';

export default class PhotosModal extends React.Component {
    render() {
        const { onClose, photos, isOpen } = this.props
        const photosUri = photos.map(photo => { return `${appConfig.baseServerUrl}/${photo}` })
        if(!photosUri.length) return <View></View>

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(photosUri)

        return (
            <Portal>
                <Modal visible={isOpen} onDismiss={onClose} contentContainerStyle={styles.modal}>
                    <Card>
                        <Title style={{ textAlign: 'center' }}>תמונות</Title>                        
                        <ListView  contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}}
                                   dataSource={dataSource} 
                                   pageSize={3}                    
                                   renderRow={(data, rowID, sectionID) => (
                                <Image  source={{ uri: data }} style={{ width: 125, height: 125, margin:5 }} />)} />                                    
                    </Card>
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
    },
    listView: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
