const { notificationsTypes } = require('./notificationsTypes')
const newMessageToFeed = require('./newMessageToFeed')

const notificationsFuncs = {
    [notificationsTypes.NEW_MESSAGE_TO_FEED]: newMessageToFeed.getParentIds
}

const notificationsMessages = {
    [notificationsTypes.NEW_MESSAGE_TO_FEED]: newMessageToFeed.message
}

module.exports = { notificationsFuncs, notificationsMessages }