const { Expo } = require('expo-server-sdk');
const { notificationsFuncs, notificationsMessages } = require('./notifications');

const expo = new Expo();
this.usersTokens = []
const isTokenValid = (token) => Expo.isExpoPushToken(token)

class pushNotificationsService {
    // DOTO: check out if the token is unique
    saveToken(newUserToken){
        if (!isTokenValid(newUserToken.token)) throw new Error('invalid token')
        const isUserRegisteredBefore = this.usersTokens.some(token => token.user.id === newUserToken.user.id)
        if (isUserRegisteredBefore) {
            this.usersTokens = this.usersTokens.map(token => token.user.id === newUserToken.user.id ? newUserToken : token)
        } else {
            this.usersTokens.push(newUserToken)
        }
    }

    async push(messageType, details, token) {
        if (!isTokenValid(token)) throw new Error('invalid token')

        const ids = await notificationsFuncs[messageType](details)
        const usersToSendPushNotification = this.usersTokens.filter(userToken => ids.some(id => id === userToken.user.id))
        let notificationsToSend = [];
        for (let user of usersToSendPushNotification) {
            if (!isTokenValid(user.token)) {
                console.error(`Push token ${user.token} is not a valid Expo push token`);
                continue;
            }

            notificationsToSend.push({
                to: user.token,
                sound: 'default',
                title: 'Hoogi',
                body: notificationsMessages[messageType](details),
                data: {
                    messageType
                }
            })
        }

        if(notificationsToSend.length === 0) return

        let chunks = expo.chunkPushNotifications(notificationsToSend);
        (async () => {
            for (let chunk of chunks) {
                try {
                    let receipts = await expo.sendPushNotificationsAsync(chunk);
                    console.log(receipts);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    }
}


module.exports = new pushNotificationsService()