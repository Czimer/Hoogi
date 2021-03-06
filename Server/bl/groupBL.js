const DataAccess = require('../dal/DataAccess')
const fs = require('fs')
const path = require('path')
const appConfig = require('../appConfig')
const childBL = require('./childBL')
const face = require('../faceRecognition/faceRecognition')

class groupBL {

    static async GetAllGroups() {
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
        LEFT JOIN (SELECT * FROM GROUPS) grp ON (hoogs.id = grp.hoog_id)`;

        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }
    
     static async GetAllGroupOfHoogKind(req, res, next){
        const groupId = req.body.groupId;
        const query = `select id, name from groups where hoog_id in (select hoog_id from groups where id = ${groupId})`;

        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async GetAllGroupsOfSpecificManager(req, res, next) {
        const managerId = req.body.managerId;
        const query = `SELECT  
            grp.id,
            grp.name,
            grp.min_age, 
            grp.max_age,            
            CASE WHEN LOWER(grp.gender) LIKE 'female' THEN 'נקבה' ELSE 'זכר' END AS gender,
            grp.group_times::json->>'day' YOM,
            grp.group_times::json->>'time' SHAA,
            grp.max_participants,
            grp.equipment     
        FROM hoogs hoogs
        INNER JOIN (SELECT * FROM GROUPS) grp ON (hoogs.id = grp.hoog_id)
        WHERE hoogs.manager_id = '` + managerId + `'`;

        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async addNewGroup(req, res, next) {

        const params = req.body.groupData;
        const hoogId = params.hoogId;
        const minAge = params.minAge;
        const maxAge = params.maxAge;
        const gender = params.gender === 'נקבה' ? 'female' : params.gender === 'זכר' ? 'male' : params.gender;
        const day = params.day;
        const time = params.selectedHours + `:` + params.selectedMinutes
        const maxParticipants = params.maxParticipants;
        const groupName = params.groupName;
        let equipment = this.equipmentHandling(params.equipment);

        if(hoogId != undefined && minAge != undefined && maxAge != undefined &&
             gender != undefined && day != undefined && time != undefined && maxParticipants != undefined && groupName != undefined && equipment != undefined){
            const query = `INSERT INTO GROUPS(HOOG_ID, MIN_AGE, MAX_AGE, GENDER, GROUP_TIMES, MAX_PARTICIPANTS, NAME, EQUIPMENT) VALUES(` +
                        hoogId + `, ` + minAge + `, ` + maxAge + `, '` + gender + `', '{"day":"` + day + `", "time":"` + time + `"}', ` 
                        + maxParticipants + `, '` + groupName + `','` + equipment + `')`;

            try{
                const results = await DataAccess.executeQuery(query);
                return results
            }
            catch(err){
                throw err
            }
        }
        else{
            throw "Could not add a new group. Not all fields are properly formed \n groupsBL:addNewGroup";
        }
        
    }

    static equipmentHandling(p_equipment){
        let equipment = `{`;   
        if(p_equipment !== null){
            if(p_equipment.indexOf(',') >-1){
                p_equipment.split(',').forEach(function(currEq){
                    equipment += `"${currEq}", `
                })
            }
            else if(p_equipment.indexOf(' ') >-1){
                p_equipment.split(' ').forEach(function(currEq){
                    equipment += `"${currEq}", `
                })
            }else{
                equipment += `"${p_equipment}", `
            }
            equipment = equipment.substr(0, equipment.length - 2);
            equipment += `}`
            return equipment;
        }    
    }

    static async editGroupById(req, res, next){

        const params = req.body.groupData;
        const groupId = params.groupId;
        const minAge = params.minAge;
        const maxAge = params.maxAge;
        const gender = params.gender === 'נקבה' ? 'female' : params.gender === 'זכר' ? 'male' : params.gender;
        const day = params.day;
        const time = params.selectedHours + `:` + params.selectedMinutes
        const maxParticipants = params.maxParticipants;
        const groupName = params.groupName;
        let equipment = this.equipmentHandling(params.equipment);

        if(minAge && maxAge && gender && day && time && maxParticipants){
            const query = `UPDATE GROUPS SET MIN_AGE = ` + minAge + `, MAX_AGE = ` + maxAge + 
            `, GENDER =  '` + gender + `', GROUP_TIMES = '{"day":"` + day + `", "time":"` + time + `"}',
             MAX_PARTICIPANTS = ` + maxParticipants + `, NAME = '` + groupName + `', EQUIPMENT = '` + equipment + `'`
              + ` WHERE ID = ` + groupId;
                     

            try {
                const results = await DataAccess.executeQuery(query);
                return results
            }
            catch (err) {
                throw err
            }
        }
        else {
            throw "Could not edit the group. Not all fields are properly formed \n groupsBL:addNewGroup";
        }

    }

    // insert new existing kid to the group by connecting his id to the relevant group
    static async RegisterNewParticipantTpGroup(req, res, next) {
        const groupId = req.body.groupId;
        const childId = req.body.childId;
        var groupResult = '';
        var childResult = '';
        var groupQuery = `with parts_count as(
                                select count(*) parts, group_id from participants
                                group by group_id)		
                                SELECT MIN_AGE, MAX_AGE, GENDER, MAX_PARTICIPANTS, parts_count.*
                                FROM GROUPS		
                                left join parts_count on (parts_count.group_id = id)
                                WHERE ID = ` + groupId;
        var childQuery = `SELECT date_part('year',age(birth_date)) as age, gender  FROM CHILDREN WHERE CHILD_ID = '` + childId + `'`;
        var insertQuery = '';

        var minAge;
        var maxAge;
        var groupGender;
        var childGender;
        var maxParticipants;
        var childAge;
        var currentNumberOfParticipants;

        try{
            groupResult = await DataAccess.executeQuery(groupQuery);            
        }
        catch (err) {
            throw err
        }

        try{
            childResult = await DataAccess.executeQuery(childQuery);
        }
        catch(err){
            throw(err);
        }

        minAge = parseInt(groupResult[0].min_age);
        maxAge = parseInt(groupResult[0].max_age);
        currentNumberOfParticipants = groupResult[0].parts == null ? 0 : parseInt(groupResult[0].parts);
        maxParticipants = parseInt(groupResult[0].max_participants);
        groupGender = groupResult[0].gender;
        childGender = childResult[0].gender;
        childAge = parseInt(childResult[0].age);

        if(currentNumberOfParticipants < maxParticipants && childAge < maxAge && childAge > minAge && childGender.toLowerCase() === groupGender.toLowerCase()){
            insertQuery = `INSERT INTO PARTICIPANTS(group_id, child_id) values(` + groupId + `, '` + childId + `')`;

            try{
                const results = await DataAccess.executeQuery(insertQuery);
                return results
            }
            catch(err){
                throw err
            }
    
        }else{
             throw 'The child could not be registered to this group';
        }
       
    }

    static async removeChildFromGroupById(req, res, next) {
        const groupId = req.body.groupId;
        const childId = req.body.childId;

        const query = `DELETE FROM PARTICIPANTS WHERE CHILD_ID = '` + childId + `' AND GROUP_ID = '` + groupId + `'`;
        
        try{
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async deleteGroupById(req, res, next) {
        const groupId = req.body.groupId;

        const deleteGroupQuery = `DELETE FROM GROUPS WHERE ID = ` + groupId;
        const deleteAllGroupApperancesInParticipantsTableQuery =
            `DELETE FROM PARTICIPANTS WHERE GROUP_ID = ` + groupId;

        try{
            await DataAccess.executeQuery(deleteGroupQuery);
            const results = await DataAccess.executeQuery(deleteAllGroupApperancesInParticipantsTableQuery);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async savePhotoByGroupMessageId(messageGroupId, { path, filename }) {
        const query = `INSERT INTO public.group_messages_photos(group_message_id, photo_blob, photo_name) VALUES ($1, $2, $3);`
        const photoBlob = fs.readFileSync(path)

        const params = [messageGroupId, photoBlob, filename]

        try {
            await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err)
        }
    }

    static async getPhotosLinks(messageGroupId,parentId,isManager){
        const photos = await this.getPhotosByMessageId(messageGroupId)
        const childrenProfilePhotosUrl = [];
        await childBL.getChildsByParentId(parentId)
        isManager = isManager === "false" ? false : isManager === "true" ? true : isManager;

        // Dana: after the fetch of the children, you are coming in!
        if(!isManager){
            const childs = await childBL.getChildsByParentId(parentId, messageGroupId)

            childs.forEach(function(currentChild){
                if(currentChild.photo_blob !== null){
                    const filePath = `${appConfig.photosPath}\\${currentChild.photo_name}`
                    fs.writeFileSync(filePath, currentChild.photo_blob)
                    childrenProfilePhotosUrl.push(filePath)                
                }
            })
        }
        

        const photosUrl = []
        const photosUrlForFaceReco = []
        photos.forEach(photo => {
            const filePath = `${appConfig.photosPath}\\${photo.photo_name}`
            // if (!path.existsSync(filePath)) {
                fs.writeFileSync(filePath, photo.photo_blob)
            // }
            photosUrl.push(`${appConfig.folderOfPhotos}/${photo.photo_name}`)
            photosUrlForFaceReco.push(filePath)
        })


        const photosUrlAfterFaceRecognition = [];
        if(childrenProfilePhotosUrl.length > 0)
            await face.loadAllNets();
            
        for(var currentChildProfilePhotoIndex in childrenProfilePhotosUrl){
            await face.loadReferencePicture(childrenProfilePhotosUrl[currentChildProfilePhotoIndex]);
            
            for(var currentPhoto in photosUrlForFaceReco){
                const isRecognized = await face.recognizeFaces(photosUrlForFaceReco[currentPhoto])
                photosUrlAfterFaceRecognition.push({photoUrl:photosUrl[currentPhoto], isRecognized:isRecognized})
            }           
        }
        if(photosUrlAfterFaceRecognition.length > 0){
            const photosToSend = photosUrlAfterFaceRecognition.sort(function(a, b){return b.isRecognized - a.isRecognized})
            .map(function(currPhoto){return currPhoto.photoUrl});
            const distinctPhotosToSend = [...new Set(photosToSend)]
            return distinctPhotosToSend;
        }


        return photosUrl;
    }

    static async getPhotosByMessageId(messageGroupId) {
        const query = `select photo_blob, photo_name
                        from  public.group_messages_photos 
                        where group_message_id = $1`


        const params = [messageGroupId]

        try {
            return await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = groupBL;