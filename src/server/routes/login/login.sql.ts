const UserSql = {
    insert: (email: string, hash: string, salt: string) => ({
      text:"INSERT INTO db.user_account(email, hash, salt) VALUES($1, $2, $3)",
      values: [email, hash, salt]
    }),
    getUserHash: (email: string) => ({
        text: 'select hash, id from db.user_account where email like $1',
        values: [email]
    })
};


export default UserSql;