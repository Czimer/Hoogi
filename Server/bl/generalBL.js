const userBL = require('./userBL')

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

    static async performSignIn() {
        return await userBL.GetUserData(email, password)
    }
}

module.exports = generalBL;