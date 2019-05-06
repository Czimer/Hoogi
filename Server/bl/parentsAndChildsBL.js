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

    static async DeleteChildByID(req, res, next){
        const childId = req.body.childId;
        const query = `DELETE FROM CHILDREN WHERE CHILD_ID = ` + childId;
        
        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err
        }
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
        WHERE PARTS.GROUP_ID = ` + groupId;
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
// module.exports = childBL;
module.exports = parentAndChildBL;