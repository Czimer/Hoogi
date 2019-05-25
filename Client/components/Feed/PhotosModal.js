import React from 'react';
import { Image, StyleSheet,View } from "react-native";
import appConfig from '../../appConfig';
import { Portal, Modal, Card, Title } from 'react-native-paper';

export default class PhotosModal extends React.Component {
    render() {
        const { onClose, photos, isOpen } = this.props
        const photosUri = photos.map(photo => { return `${appConfig.baseServerUrl}/${photo}` })
        return (
            <Portal>
                <Modal visible={isOpen} onDismiss={onClose} contentContainerStyle={styles.modal}>
                    <Card>
                        <Title style={{textAlign:'center'}}>תמונות</Title>
                        <View style={{ flexDirection: 'row'}}>
                        {photosUri.map(photo => {
                            return <Image key={photo} source={{ uri: photo }} style={{ width: 150, height: 150 }} />

                        })}
                        </View>
                    </Card>
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff'
    },
    card:{        
        justifyContent: 'center',
        alignItems: 'center',
    }
});
