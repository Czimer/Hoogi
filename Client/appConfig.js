const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const baseServerUrl = 'http://10.0.0.29:3000';

const appConfig = {
    baseServerUrl:baseServerUrl,
    ServerGraphqlUrl: `${baseServerUrl}/graphql`,
    ServerApiUrl: `${baseServerUrl}/api`,
    regex
}

export default appConfig