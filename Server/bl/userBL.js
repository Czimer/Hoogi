const DataAccess = require('../dal/DataAccess')
const crypto = require('../utils/crypto')

class userBL {
    static async GetAllUsers() {
        const query = `SELECT id, user_type, email, password
        FROM public.users`

        try {
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch (err) {
            throw err
        }
    }

    static async addNewUser(role, email, password) {
        const query = `INSERT INTO public.users(user_type, email, password)
                        VALUES ($1, $2, $3);`;


        const encryptedPassword = crypto.encrypt(password)

        const params = [role, email, encryptedPassword]
        try {
            await DataAccess.executeQuery(query, params);
        }
        catch (err) {
            throw err
        }
    }

    static async GetUserData(email, password) {
        const query = `select id,user_type from public.users where email = $1 and password = $2`;

        const encryptedPassword = crypto.encrypt(password)

        const params = [email, encryptedPassword]
        try {
            const results = await DataAccess.executeQuery(query, params);
            return results[0]
        }
        catch (err) {
            throw err
        }
    }

    static async addNewParent(userId, personalId, first_name, last_name, gender, phone) {
        const query = `INSERT INTO public.parents(
            id, parent_id, first_name, last_name, gender, phone)
            VALUES ($1, $2, $3,$4, $5,$6);`;

        const params = [userId, personalId, first_name, last_name, gender, phone]
        try {
            await DataAccess.executeQuery(query, params);
        }
        catch (err) {
            throw err
        }
    }

    static async addNewManager(userId, personalId, first_name, last_name, gender, phone) {
        const query = `INSERT INTO public.managers(
            id, manager_id, first_name, last_name, gender, phone)
            VALUES ($1, $2, $3,$4, $5,$6);`;

        const params = [userId, personalId, first_name, last_name, gender, phone]
        try {
            await DataAccess.executeQuery(query, params);
        }
        catch (err) {
            throw err
        }
    }

}

module.exports = userBL