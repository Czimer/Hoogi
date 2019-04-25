const DataAccess = require('../dal/DataAccess')


class groupBL {
    static async GetAllGroups(){
        const query = `SELECT  
        grp.max_participants,
        grp.group_times::json->>'time' SHAA,
        grp.group_times::json->>'day' YOM,
        grp.gender,
        grp.max_age,
        grp.min_age, 
        hoogs.name, 
        grp.id       
    FROM hoogs hoogs
    LEFT JOIN (select * from groups) grp ON (hoogs.id = grp.hoog_id)`;
        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }
    
    static async GetAllGroupsOfSpecificManager(req, res, next){
        const managerId = req.query.managerId;
        const query = `SELECT  
            grp.max_participants,
            grp.group_times::json->>'time' SHAA,
            grp.group_times::json->>'day' YOM,
            grp.gender,
            grp.max_age,
            grp.min_age, 
            hoogs.name, 
            grp.id       
        FROM hoogs hoogs
        LEFT JOIN (select * from groups) grp ON (hoogs.id = grp.hoog_id)
        WHERE hoogs.manager_id = '` + managerId + `'`; // todo - add null check of groups?

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }

    static async RegisterNewParticipantTpGroup(req,res,next){
        const groupId = res.params.groupId;
        const childId = res.params.childId;

        const query = `INSERT INTO public.participants (` + groupId + `, ` + childId + `)`;

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