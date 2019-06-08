const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const baseServerUrl = 'http://10.100.102.10:3000';

const appConfig = {
    ServerGraphqlUrl: `${baseServerUrl}/graphql`,
    ServerApiUrl: `${baseServerUrl}/api`,
    regex
}

export default appConfig