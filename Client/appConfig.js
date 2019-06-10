const regex = {
    phone: new RegExp("^[0-9]{10}$"),
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

const baseServerUrl = 'http://10.0.0.40:3000';

const appConfig = {
    baseServerUrl:baseServerUrl,
    ServerGraphqlUrl: `${baseServerUrl}/graphql`,
    ServerApiUrl: `${baseServerUrl}/api`,
    regex,
    locationApiKey:'AIzaSyDe2cx9NLqtDipMKZ1J2EeioMAn2W9L_20',
    hebCalendar: {
        monthNames: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
        monthNamesShort: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
        dayNames: ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],
        dayNamesShort: [`א'`,`ב'`,`ג'`,`ד'`,`ה'`,`ו'`,`ש'`]
      }
}

export default appConfig