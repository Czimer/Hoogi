    const DataAccess = require('../dal/DataAccess')


class hoogBL {
    static async GetAllHoogs(){
        const query = `select * from groups
        left join hoogs on hoogs.id = groups.hoog_id`;

        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }

    static async GetHoogsByParams(req, res, next){
        const params = req.params;

        var query = `select hoogs.name, hoogs.id, grp.id as 'groupId', grp.min_age || '-' || grp.max_age as 'ageRange',
                    hoogs.address as location, mng.first_name || ' ' || mng.last_name as 'guidName',
                    mng.phone as 'guidPhone', grp.gender, hoogs.tags, 
                     from public.groups grp
                    left join public.hoogs hoogs on hoogs.id = groups.hoog_id`;

        var whereConditions = ` where `;
            whereConditions += params.gender ? `gender like ` + params.gender + ' or ' : ``;
            whereConditions += params.minAge ? `min_age >= ` + params.minAge  + ' or ' : ``;
            whereConditions += params.maxAge ? `max_age =< ` + params.maxAge  + ' or ' : ``;
            whereConditions += params.location ? `address like  ` + params.location  + ' or ' : ``;
            // whereConditions += params.tags ? `address like  ` + params.tags : ``; todo - figure out how to do it with an object on postgres

        whereConditions = whereConditions.endsWith(' or ') ? whereConditions.substr(whereConditions.lastIndexOf(' or '), 4) : whereConditions;
        query = whereConditions === ` where ` ? query + whereConditions : query;

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }
}
module.exports = hoogBL;