const userBL = require('../bl/userBL')
const { notificationsIds } = require('./notificationsTypes')

class newMessageToFeed {
    async getParentIds(details) {
        return await userBL.getParentIdsByGroupId(details.groupId, notificationsIds.NEW_MESSAGE_TO_FEED)
    }

    message(details) {
        return `הודעה חדשה מקבוצת ${details.groupName}`
    }
}

module.exports = new newMessageToFeed()
