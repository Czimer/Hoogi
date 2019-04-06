    const DataAccess = require('../dal/DataAccess')


class hoogBL {
    static async GetAllHoogs(){
        const query = `SELECT id, manager_id, name, address, tags, description
        FROM public.hoogs`

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

        var query = `select * from groups
                    left join hoogs on hoogs.id = groups.hoog_id`;

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