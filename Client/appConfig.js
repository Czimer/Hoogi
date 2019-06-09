const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const baseServerUrl = 'http://192.168.1.7:3000';

const appConfig = {
    baseServerUrl:baseServerUrl,
    ServerGraphqlUrl: `${baseServerUrl}/graphql`,
    ServerApiUrl: `${baseServerUrl}/api`,
    regex,
    locationApiKey:''
}

export default appConfig