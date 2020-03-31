import {Pool} from "pg";
import {config} from "dotenv"
import pgFormat from "pg-format";

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


export namespace db{
    export function insert<T>(tableName: string, values: Array<T>){
        const val = values[0];

        const parsedValues = values.map(i => Object.values(i));
        return pgFormat(`INSERT INTO ${tableName} (${Object.keys(val).join(",")}) VALUES %L`, parsedValues);
    }
}


export const dbCtrl = new DbCtrl();


(async () => {
    const {pool} = dbCtrl;

    // await pool.query('DROP TABLE IF EXISTS users');
    // await pool.query(`CREATE TABLE users (id serial PRIMARY KEY, password VARCHAR (50) NOT NULL, email VARCHAR (355) UNIQUE NOT NULL, hash BYTEA)`);
})();


