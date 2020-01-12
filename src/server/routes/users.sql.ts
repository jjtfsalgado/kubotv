import {IRouteSql} from "./interface";

const UserSql: IRouteSql = {
    get: () => ({
      text: "select * from users"
    }),
    getOne: (id: string) => ({
        text: "select * from users where id like $1",
        values: [id]
    }),
    post: (password: string, email: string) => ({
      text:"INSERT INTO users(password, email) VALUES($1, $2)",
      values: [password, email]
    })
};



export default UserSql;