import {Client} from "pg";
import {config} from 'dotenv';

config();

class Db {
    async init() {
        const connectionString = process.env.DATABASE_URL;

        const client = new Client({
            connectionString,
            ssl: true
        });

        await client.connect();
        const res = await client.query('SELECT version();');
        console.log(JSON.stringify(res));
        console.log("buuuuuu")

        await client.end();
    };
};

const db = new Db();

export default db;