import {IRouteSql} from "../interface";

const UserSql = {
    get: () => ({
      text: "select * from users"
    }),
    getOne: (id: string) => ({
        text: "select * from users where id like $1",
        values: [id]
    }),
    insert: (email: string, hash: string, salt: string) => ({
      text:"INSERT INTO users(email, hash, salt) VALUES($1, $2, $3)",
      values: [email, hash, salt]
    }),
    getUserHash: (email: string) => ({
        text: 'select hash from users where email like $1',
        values: [email]
    })
};



export default UserSql;