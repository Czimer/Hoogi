    const DataAccess = require('../dal/DataAccess')


class hoogBL {
    static async GetAllHoogs(){
        const query = `select hoogs.name, hoogs.id, grp.id, grp.min_age || '-' || grp.max_age as age_Range,
        hoogs.address loc, mng.first_name || ' ' || mng.last_name as guid_Name,
        mng.phone guid_Phone, grp.gender, hoogs.tags
        from public.groups grp
        left join public.hoogs hoogs on hoogs.id = grp.hoog_id
		left join public.managers mng on mng.manager_id = hoogs.manager_id`;

        try{
            const results = await DataAccess.executeQuery(query);

            return results
        }
        catch(err){
            throw err
        }
    }

    static async GetHoogsByParams(req, res, next){
        const params = req.body;

        var query = `select hoogs.name, hoogs.id, grp.id, grp.min_age || '-' || grp.max_age as age_Range,
        hoogs.address loc, mng.first_name || ' ' || mng.last_name as guid_Name,
        mng.phone guid_Phone, grp.gender, hoogs.tags
        from public.groups grp
        left join public.hoogs hoogs on hoogs.id = grp.hoog_id
		left join public.managers mng on mng.manager_id = hoogs.manager_id`;

        var whereConditions = ` where `;
            whereConditions += params.gender ? `gender like ` + params.gender + ' or ' : ``;
            whereConditions += params.minAge ? `min_age >= ` + params.minAge  + ' or ' : ``;
            whereConditions += params.maxAge ? `max_age <= ` + params.maxAge  + ' or ' : ``;
            whereConditions += params.location ? `(select * from distance(hoogs.latitude, ` 
                                + params.location.split(',')[0] + `, hoogs.longitude, ` + params.location.split(',')[1] + `)) < 8 ` // TODO: make the distance a global const
                                + ' or ' : ``;
            if(params.tags){
                _.forEach(params.tags.split(' '), function(currTag){
                    whereConditions += `array_to_string(tags, ' ') like  '%` + currTag + `%' or `
                });
            }                                            

        whereConditions = whereConditions.endsWith(' or ') ? whereConditions.substr(0, whereConditions.lastIndexOf(' or ')) : whereConditions;
        query = whereConditions !== ` where ` ? query + whereConditions : query;

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