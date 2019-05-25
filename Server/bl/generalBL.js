const userBL = require('./userBL')
const groupBL = require('./groupBL')
const childBL = require('./childBL')
const ParentRole = 'הורה'

class generalBL {
    static async performSignUp(signUpDetails) {
        const { personalId, firstName, lastName, email, phone, password, role, gender } = signUpDetails

        try {
            await userBL.addNewUser(role, email, password)
            const userData = await userBL.GetUserData(email, password)
            if (role === ParentRole) {
                await userBL.addNewParent(userData.id, signUpDetails.personalId, firstName, lastName, gender, phone)
            } else {
                await userBL.addNewManager(userData.id, signUpDetails.personalId, firstName, lastName, gender, phone)
            }
        }
        catch (err) {
            throw err
        }
    }

    static async performSignIn(email, password) {
        return await userBL.GetUserData(email, password)
    }

    static async saveFilAsBlob(bodyParams, file) {
        if (Object.keys(bodyParams)[0] === "messageId") {
            await groupBL.savePhotoByGroupMessageId(bodyParams.messageId, file)
        } else {
            await childBL.saveChildPhoto(bodyParams.childId, file)
        }
    }
}

module.exports = generalBL;