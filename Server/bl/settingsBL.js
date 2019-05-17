const DataAccess = require('../dal/DataAccess')

class settingsBL {
    static async GetParentSettings(parentId) {
        const query = `SELECT sett_fam.name as family_name, sett.text, p_sett.is_active
                       FROM settings sett, settings_families sett_fam, parent_settings p_sett 
                       WHERE sett_fam.id = sett.family_id AND sett.id = p_sett.setting_id AND parent_id = '${parentId}'`;

        try {
            const results = await DataAccess.executeQuery(query);
            console.log(results);
            return results;
        }
        catch(err){
            throw err;
        }
    }
}

module.exports = settingsBL;