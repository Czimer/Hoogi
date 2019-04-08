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
    
    static async GetAllGroupsOfSpecificManager(req, res, next){
        const managerId = res.params.managerId;
        const query = `SELECT groups.id, hoog.name 'HoogName', min_age as 'MinAge', max_age as 'MaxAge', gender as 'Gender',
         group_time as 'groupTime', max_participents as 'maxParticipents'
        FROM public.hoog groups
        LEFT JOIN public.group groups ON (hoogs.id == groups.hoog_id)
        WHERE hoogs.manager_id = ` + managerId; // todo - add null check of groups?

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