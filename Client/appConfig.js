const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const appConfig = {
    ServerGraphqlUrl: 'http://localhost:3000/graphql',
    ServerApiUrl: 'http://localhost:3000/api',
    regex
}

export default appConfig