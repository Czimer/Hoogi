import { Permissions, Notifications } from "expo";
import appConfig from "../appConfig";
import { AsyncStorage } from "react-native";
export default class PushNotificationService {
    static registerForPushNotificationsAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        let token = await Notifications.getExpoPushTokenAsync();
        const loginData = await AsyncStorage.getItem('loginData');
        const { id, user_type } = JSON.parse(loginData)

        try {
            await fetch(`${appConfig.ServerApiUrl}/general/registerPushService`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    user: {
                        userId: id,
                        userType: user_type
                    },
                }),
            });
            return token
        }
        catch (err) {
            console.log(err)
        }
    }

    static sendPushNotification = async (messageType,details) => {
        const loginData = await AsyncStorage.getItem('loginData');
        const { token } = JSON.parse(loginData)

        // user is not allowed to send push notification if he doesnt confirm to recieve one
        if(!token) return

        fetch(`${appConfig.ServerApiUrl}/general/pushMessage`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messageType,
                details,
                token
            }),
          });
    }
}