const DataAccess = require('../dal/DataAccess')


class parentBL {
    static async GetAllPArents(){
        const query = `SELECT *
        FROM public.parents` 

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
        FROM public.children` 

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
        const groupId = res.params.groupId;
        const query = `SELECT PARENTS.FIRST_NAME || PARENTS.LAST_NAME AS PARENT_FULL_NAME,
        CHILDREN.FIRST_NAME || CHILDREN.LAST_NAME AS CHILD_FULL_NAME,
        PARENT.PARENT_PHONE, CHILD.CHILD_PHONE, PARENT.GENDER AS PARENT_GENDER, CHILD.GENDER AS CHILD_GENDER,
        CHILD.BIRTH_DATE, CHILD.CHILD_ID
        FROM public.children CHILD, public.parents PARENT
        INNER JOIN public.participants PARTS ON (PARTS.CHILD_ID == CHILD.ID)
        LEFT JOIN public.groups GRP ON (GRP.ID == PARTS.GROUP_ID))
        WHERE CHILD.CHILD_ID IN PARENT.CHILDREN_ARRAY`; // TODO - CHECK HOW TO RELATE GROUPS TO CHILDREN

        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch(err){
            throw err;
        }

    }
}

module.exports = parentBL;
module.exports = childBL;
module.exports = parentsAndChildrenBL;