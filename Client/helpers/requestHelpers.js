import { Platform } from "react-native";


export const createFormData = (photo, body) => {
    const data = new FormData();
    
    let localUri = photo.uri;
    let fileName = localUri.split('/').pop();

    let type = `image/jpeg`;

    data.append("photo", {
        name: fileName,
        type: type,
        uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("content://", "")
    });

    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });

    return data;
};