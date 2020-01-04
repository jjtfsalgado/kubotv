const cfg = require('../../config');
const {Client} = require('pg');

class Db {
    async init() {

        const client = new Client({
            connectionString: cfg._DEV_ ? cfg._DATABASE_URL_ : process.env.DATABASE_URL,
            ssl: true
        });

        await client.connect();
        const res = await client.query('SELECT table_schema,table_name FROM information_schema.tables;');
        // for (let row of res.rows) {
        // console.log(JSON.stringify(row));
        // }
        await client.end();
    };
};

const db = new Db();

export default db;