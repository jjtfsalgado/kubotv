import {Client} from "pg";
const cfg = require('../../config');

class Db {
    async init() {

        const client = new Client({
            connectionString: cfg._DEV_ ? cfg._DATABASE_URL_ : process.env.DATABASE_URL,
            ssl: true
        });

        await client.connect();
        const res = await client.query('SELECT version();');
        // for (let row of res.rows) {
        // console.log(JSON.stringify(row));
        // }
        console.log(res)

        await client.end();
    };
};

const db = new Db();

export default db;