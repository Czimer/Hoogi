const DataAccess = require('../dal/DataAccess');

class eventBL {
    static async UpdateEvent() {
        const query = ``;
        
        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }

    static async CreateEvent() {
        const query = ``;
        
        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }

    static async GetEventsByGroups(groupsIds) {
        console.log(groupsIds);

        const query = `SELECT evt.id as id, evt.group_id as group_id, grp.name as group_name, evt.start_time as start_time, evt.end_time as end_time, evt.location as location, evt.equipment as equipment, evt.description as description 
                       FROM events evt, groups grp
                       WHERE evt.group_id = grp.id AND evt.group_id = ANY(ARRAY[${groupsIds}])`;
        
        try {
            const results = await DataAccess.executeQuery(query);    
            return results;
        }
        catch(err){
            throw err
        }
    }
}

module.exports = eventBL;