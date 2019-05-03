const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const appConfig = {
    ServerGraphqlUrl: 'http://10.100.102.9:3000/graphql',
    ServerApiUrl: 'http://10.100.102.9:3000/api',
    regex
}

export default appConfig