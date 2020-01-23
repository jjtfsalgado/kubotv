import {Pool, QueryConfig} from "pg";
import {config} from "dotenv"
config();


class DbCtrl {
    private readonly _pool: Pool;

    constructor() {
        this._pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true
        });
    }

    get pool(){
        return this._pool
    }
};

export const dbCtrl = new DbCtrl();


(async () => {
    const {pool} = dbCtrl;

    // await pool.query('DROP TABLE IF EXISTS users');
    // await pool.query(`CREATE TABLE users (id serial PRIMARY KEY, password VARCHAR (50) NOT NULL, email VARCHAR (355) UNIQUE NOT NULL, hash BYTEA)`);
})();


