import {Client} from "pg";
import {_DEV_} from "../../global";


class Db {
    async init() {
        let connectionString;
        if(_DEV_){
            const r = await import("../../config");
            connectionString = r._DATABASE_URL_;
        }else{
            connectionString = process.env.DATABASE_URL;
        }

        const client = new Client({
            connectionString,
            ssl: true
        });

        await client.connect();
        const res = await client.query('SELECT version();');
        // for (let row of res.rows) {
        // console.log(JSON.stringify(row));
        // }
        console.log("buuuuuu")

        await client.end();
    };
};

const db = new Db();

export default db;