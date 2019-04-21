const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')
}

const appConfig = {
    ServerGraphqlUrl: 'http://localhost:3000/graphql',
    ServerApiUrl: 'http://localhost:3000/api',
    regex
}

export default appConfig