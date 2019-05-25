const DataAccess = require('../dal/DataAccess')
const fs = require('fs')
const path = require('path')
const appConfig = require('../appConfig')
const childBL = require('./childBL')

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

    static async GetAllGroupsOfSpecificManager(req, res, next) {
        const managerId = req.body.managerId;
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
        INNER JOIN (SELECT * FROM GROUPS) grp ON (hoogs.id = grp.hoog_id)
        WHERE hoogs.manager_id = '` + managerId + `'`; // todo - add null check of groups?

        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async addNewGroup(req, res, next) {

        const hoogId = req.body.hoogId;
        const minAge = req.body.minAge;
        const maxAge = req.body.maxAge;
        const gender = req.body.gender;
        const day = req.body.day;
        const time = req.body.time;
        const maxParticipants = req.body.maxParticipants;

        if (hoogId && minAge && maxAge && gender && day && time && maxParticipants) {
            const query = `INSERT INTO GROUPS(HOOG_ID, MIN_AGE, MAX_AGE, GENDER, GROUP_TIME, MAX_PARTICIPANTS) VALUES(` +
                hoogId + `, ` + minAge + `, ` + maxAge + `, ` + gender + `, ` + day + `, ` + time + `, ` + maxParticipants + `)`;

            try {
                const results = await DataAccess.executeQuery(query);
                return results
            }
            catch (err) {
                throw err
            }
        }
        else {
            throw "Could not add a new group. Not all fields are properly formed \n groupsBL:addNewGroup";
        }

    }

    // insert new existing kid to the group by connecting his id to the relevant group
    static async RegisterNewParticipantTpGroup(req, res, next) {
        const groupId = req.body.groupId;
        const childId = req.body.childId;

        const query = `INSERT INTO PARTICIPANTS (` + groupId + `, ` + childId + `)`;

        try {
            const results = await DataAccess.executeQuery(query);
            return results
        }
        catch (err) {
            throw err
        }
    }

    static async removeChildFromGroupById(req, res, next) {
        const groupId = req.body.groupId;
        const childId = req.body.childId;

        const query = `DELETE FROM PARTICIPANTS WHERE CHILD_ID = ` + childId + `AND GROUP_ID = ` + groupId;

        try {
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

        try {
            const results = await DataAccess.executeQuery(deleteGroupQuery);
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

    static async getPhotosLinks(messageGroupId,entityId,isManager){
        const photos = await this.getPhotosByMessageId(messageGroupId)
        
        // Dana: after the fetch of the children, you are coming in!
        //if(!isManager){
            //const childs = await childBL.getChildsByParentId(parentId)
            // face recognition logic
        //}
        

        const photosUrl = []
        photos.forEach(photo => {
            const filePath = `${appConfig.photosPath}\\${photo.photo_name}`
            // if (!path.existsSync(filePath)) {
                fs.writeFileSync(filePath, photo.photo_blob)
            // }
            photosUrl.push(`${appConfig.folderOfPhotos}/${photo.photo_name}`)
        })

        
        return photosUrl
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