const { Pool } = require('pg')
const config = require('../appConfig')

let pool = new Pool({connectionString: config.ConnectionString});

class DataAccess {

  static createConnection(){
   // pool = 
  }

  static async executeQuery(query, params = []) {
    let client;
    try {
      client = await pool.connect()
      const results = await client.query(query, params)

      return results.rows
    }
    catch (ex) {
      console.log("error", ex)
    }
    finally {
      if(client) client.end()
    }
  }
}

module.exports = DataAccess