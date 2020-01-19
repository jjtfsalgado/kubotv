import {IRouteSql} from "./interface";

const UserSql = {
    get: () => ({
      text: "select * from users"
    }),
    getOne: (id: string) => ({
        text: "select * from users where id like $1",
        values: [id]
    }),
    insert: (password: string, email: string, hash: string, salt: string) => ({
      text:"INSERT INTO users(password, email, hash, salt) VALUES($1, $2, $3, $4)",
      values: [password, email, hash, salt]
    }),
    getUserSalt: (email: string) => ({
        text: 'select salt,hash from users where email like $1',
        values: [email]
    })
};



export default UserSql;