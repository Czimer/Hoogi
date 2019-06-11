const DataAccess = require('../dal/DataAccess');

class eventBL {
    static async UpdateEvent(event) {
        const start_time = new Date(`${event.date} ${event.start_time}`);
        start_time.setHours(start_time.getHours() + 6);
        const end_time = new Date(`${event.date} ${event.end_time}`);
        end_time.setHours(end_time.getHours() + 6);

        const query = `UPDATE events 
                       SET start_time = '${start_time.toISOString().replace('T', ' ').slice(0, 16)}', end_time = '${end_time.toISOString().replace('T', ' ').slice(0, 16)}', location = '${event.location}', 
                           equipment = '{${event.equipment}}', description = '${event.description}' 
                       WHERE id = ${event.id}`;
        
        console.log(query);

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