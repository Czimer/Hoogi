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

    static async GetAllHoogsNames(req, res, next){
        const manager_id = req.body.managerId;
        const query = `SELECT ID, NAME FROM HOOGS WHERE MANAGER_ID = '` + manager_id + `'`;
        // const query = `SELECT ID, NAME FROM HOOGS`;

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

        var query = `select grp.name, hoogs.id hoog_id, grp.id group_id, grp.min_age || '-' || grp.max_age as age_Range,
        hoogs.address loc, grp.group_times, mng.first_name || ' ' || mng.last_name as guid_Name,
        mng.phone guid_Phone, grp.gender, hoogs.tags
        from public.groups grp
        left join public.hoogs hoogs on hoogs.id = grp.hoog_id
		left join public.managers mng on mng.manager_id = hoogs.manager_id`;

        var whereConditions = ` where `;
            whereConditions += params.gender ? `grp.gender like '` + params.gender + `' or ` : ``;
            whereConditions += params.minAge ? `min_age >= ` + params.minAge  + ' or ' : ``;
            whereConditions += params.maxAge ? `max_age <= ` + params.maxAge  + ' or ' : ``;
            whereConditions += params.location ? `(select * from distance(hoogs.latitude, ` 
                                + params.location.split(',')[0] + `, hoogs.longitude, ` + params.location.split(',')[1] + `)) < 8 ` // TODO: make the distance a global const
                                + ' or ' : ``;
            if(params.tags){
                const tagsArray = params.tags.split(' ');
                tagsArray.forEach(function(currTag){
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

    static async getAllHoogsByManagerId(req, res, next){
        const params = req.body;
        const query = `SELECT ID, NAME, ADDRESS, TAGS, DESCRIPTION  FROM HOOGS
                        WHERE MANAGER_ID = '${params.managerId}'`;       
        
        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }        
    }

    static async deleteHoogById(req, res, next){
        const params = req.body;
        const query = `DELETE FROM HOOGS WHERE ID = ${params.hoogId}`;

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }       
    }

    static async addNewHoog(req, res, next){
        const params = req.body.hoogData;
        const managerId = params.managerId;
        const name = params.hoogName;
        const address = params.address;
        const description = params.description;
        const latitude = params.location.split(',')[0];
        const longitude = params.location.split(',')[1];

        let tags = `{`;   
        
        if(params.tags !== null){
            params.tags.split(',').forEach(function(currEq){
                tags += `"${currEq}", `
            })
            tags = tags.substr(0, tags.length - 2);
        }        
        tags += `}`

        const query = `INSERT INTO HOOGS (MANAGER_ID, NAME, ADDRESS, TAGS, DESCRIPTION, LATITUDE, LONGITUDE) 
                    VALUES('${managerId}', '${name}', '${address}', '${tags}', '${description}', ${latitude}, ${longitude})`;
        
        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        } 
    }

    static async editHoog(req, res, next){
        const params = req.body.hoogData;
        const hoogId = params.hoogId;
        const name = params.hoogName;
        const address = params.address;
        const description = params.description;
        const latitude = params.location ? params.location.split(',')[0] : "";
        const longitude = params.location ? params.location.split(',')[1] : "";        

        let tags = `{`;       

        params.tags.split(',').forEach(function(currEq){
            tags += `"${currEq}", `
        })
        tags = tags.substr(0, tags.length - 2);
        tags += `}`


        var query = `UPDATE HOOGS SET 
        NAME = '${name}', 
        ADDRESS = '${address}', 
        TAGS = '${tags}', 
        DESCRIPTION = '${description}'`;
        if(longitude != "" && latitude != ""){
            query += `LATITUDE = ${latitude}, LONGITUDE =  ${longitude}`;            
        }        
        query +=  `WHERE ID = ${hoogId}`;        

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