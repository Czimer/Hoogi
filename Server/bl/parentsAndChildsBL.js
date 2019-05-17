const DataAccess = require('../dal/DataAccess')


class parentBL {
    static async GetAllParents(){
        const query = `SELECT *
        FROM parents` 

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }  

}

class childBL {
    static async GetAllChildren(){
        const query = `SELECT *
        FROM children` 

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
    }

    static async GetChildrensByParent(parentId) {
        const query = `SELECT child_id, first_name, color
                       FROM children
                       WHERE parent_id = '${parentId}'`;
        
        try {
            const results = await DataAccess.executeQuery(query);
            return results;
        }
        catch(err){
            throw err;
        }
    }

    static async GetChildernGroups(childId) {
        const query = `SELECT group_id
                       FROM participants
                       WHERE child_id = '${childId}'`;
    
        try {
            const results = await DataAccess.executeQuery(query);
            return results;
        }
        catch(err){
            throw err;
        }
    }

    static async GetChildrenEvents(parentId) {
        const childrens = await this.GetChildrensByParent(parentId);
        let events = [];
        
        for (let index = 0; index < childrens.length; index++) {
            const childrenGroups = await this.GetChildernGroups(childrens[index]['child_id']);
            const childrenGroupsIds = childrenGroups.map(group => Object.values(group));
            const query = `SELECT evt.id as id, evt.group_id as group_id, grp.name as group_name, evt.start_time as start_time, evt.end_time as end_time, evt.location as location, evt.equipment as equipment, evt.description as description 
                           FROM events evt, groups grp
                           WHERE evt.group_id = grp.id AND evt.group_id = ANY(ARRAY[${childrenGroupsIds}])`;

            try {
                const results = await DataAccess.executeQuery(query);
                
                events.push({
                    name: childrens[index]['first_name'],
                    color: childrens[index]['color'],
                    events: JSON.stringify(results)
                });
            }
            catch(err) {
                throw err;
            }
        };
        
        console.log(events);

        return (events);
    }
}


class parentAndChildBL {  
    static async GetParentsAndChildrenOfGroup(req, res, next){
        const groupId = req.body.groupId;
        const query = `SELECT 
        CHILD.CHILD_ID,
        DATE_PART('YEAR',AGE(CHILD.BIRTH_DATE)) AGE,
        CHILD.GENDER AS CHILD_GENDER,
        CHILD.PHONE CHILD_PHONE, 
        PARENT.PHONE PARENT_PHONE, 
        CHILD.FIRST_NAME || ' ' || CHILD.LAST_NAME AS CHILD_FULL_NAME,
        PARENT.FIRST_NAME || ' ' || PARENT.LAST_NAME AS PARENT_FULL_NAME
        FROM children CHILD
		INNER JOIN parents PARENT ON (CHILD.PARENT_ID = PARENT.PARENT_ID)
        INNER JOIN participants PARTS ON (PARTS.CHILD_ID = CHILD.CHILD_ID)
        LEFT JOIN groups GRP ON (GRP.ID = PARTS.GROUP_ID)	
        WHERE PARTS.GROUP_ID = ` + groupId; // TODO: FIGURE THIS SHIT OUT AND DONT USE 2 TABLES - USE ONLY JOINS
        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err;
        }

    }
}

// module.exports = parentBL;
module.exports = {
    parentAndChildBL: parentAndChildBL,
    childBL: childBL
};