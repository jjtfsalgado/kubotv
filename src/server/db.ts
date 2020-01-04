import {Client} from "pg";
import {_DEV_} from "../../global";


class Db {
    async init() {
        let connectionString;
        if(_DEV_){
            import("../../config").then(i => connectionString = i._DATABASE_URL_);
        }else{
            connectionString = process.env.DATABASE_URL;
        }

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