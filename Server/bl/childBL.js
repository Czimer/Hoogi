const DataAccess = require('../dal/DataAccess')
const fs = require('fs')
const appConfig = require('../appConfig')

class childBL {

    static async saveChildPhoto(childId, { path }) {
        const query = `UPDATE public.children
                        SET photo_blob=$1
                        WHERE child_id=$2;`

        const photoBlob = fs.readFileSync(path)

        const params = [photoBlob, childId]

        try {
            await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err)
        }
    }

    static async getChildsPhotos(childsIds) {
        
        var numberOfParams = [];
        for (var i = 1; i <= childsIds.length; i++) {
            numberOfParams.push('$' + i);
        }

        const query = `SELECT child_id ,photo_blob
        FROM public.children
        where child_id in (${numberOfParams.join(',')});`

        const params = childsIds
        let childsrensPhotos;

        try {
            childsrensPhotos = await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err);
            throw err
        }

        return childsrensPhotos.map((photo, index) => {
            let filePath = null
            if (photo.photo_blob !== null) {
                const fileName = Date.now() + index
                const filePathOnServer = `${appConfig.photosPath}\\${fileName}.jpg`
                fs.writeFileSync(filePathOnServer, photo.photo_blob)
                filePath = `${appConfig.folderOfPhotos}/${fileName}.jpg`
            }

            return { filePath, childId: photo.child_id }
        })
    }

    static async getChildsByParentId(parentId, messageGroupId) {
        const query = `with
            group_id_from_group_message_id as(
                select group_id from groups_messages where id = $1),
            children_in_groups as (
                select child_id from participants where group_id in (select group_id from group_id_from_group_message_id)
            )
            SELECT ch.child_id ,photo_blob, ch.child_id || '_private_image.jpg' as photo_name
                FROM public.children ch
                inner join children_in_groups parts on (parts.child_id = ch.child_id)
                where parent_id = $2`

        const params = [messageGroupId, parentId]

        try {
            return await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err);
            throw err
        }
    }
}

module.exports = childBL;