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
        const columns = Object.keys(val);
        const q = pgFormat(`INSERT INTO %s (%2$s) VALUES %3$L`, tableName, columns, parsedValues);

        // console.log(q);

        return q;
    }

    export function update<T>(tableName: string, values: Array<T>, primaryColumn = 'id'){
        const val = values[0];
        const setValues: Array<Array<any>> = [values.map(i => Object.values(i))];
        const setColumns: Array<string> = Object.keys(val).map(i => `${i} = x.${i}`);
        const columns: Array<string> = Object.keys(val);
        const q = pgFormat(`UPDATE %s AS y set %2$s FROM (VALUES %3$L) as x(%4$s) where x.%5$s = y.%5$s::text`, tableName, setColumns, setValues, columns, primaryColumn);

        console.log(q);

        return q;
    }
}

export const dbCtrl = new DbCtrl();

(async () => {
    const {pool} = dbCtrl;

    // await pool.query('DROP TABLE IF EXISTS users');
    // await pool.query(`CREATE TABLE users (id serial PRIMARY KEY, password VARCHAR (50) NOT NULL, email VARCHAR (355) UNIQUE NOT NULL, hash BYTEA)`);
})();


