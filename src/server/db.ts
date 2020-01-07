import {Client} from "pg";


class DbCtrl {
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

const dbCtrl = new DbCtrl();