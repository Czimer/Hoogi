const DataAccess = require('../dal/DataAccess')
const fs = require('fs')

class childBL {

    static async saveChildPhoto(childId, { path }) {
        const query = `UPDATE public.children
                        SET photo_blob=$1
                        WHERE id=$2;`

        const photoBlob = await fs.readFile(path)

        const params = [photoBlob, childId]

        try {
            await DataAccess.executeQuery(query, params)
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = childBL;