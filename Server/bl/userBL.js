const DataAccess = require('../dal/DataAccess')


class userBL {
    static async GetAllUsers(){
        const query = `SELECT id, user_type, email, password
        FROM public.users`

        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }

}

module.exports = userBL