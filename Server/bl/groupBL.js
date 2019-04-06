const DataAccess = require('../dal/DataAccess')


class groupBL {
    static async GetAllGroups(){
        const query = `SELECT id, manager_id, name, address, tags, description
        FROM public.groups` // todo - change the query to match groups

        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }
    
    static async GetAllGroupsOfSpecificManager(){
        const query = `SELECT id, manager_id, name, address, tags, description
        FROM public.groups` // todo - change the query to match groups

        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }
    

}

module.exports = groupBL;