import {Router} from "express";
import {dbCtrl} from "../db";
import UserSql from "./users.sql";

function Users(router: Router): Router {

    //get user
    router.get('/', async (req, res) => {
        const re = await dbCtrl.pool.query(UserSql.get());

        return res.status(200).json({status: "success", data: re.rows[0]});
    });

    //post user
    router.post('/', async (req, res) => {
        const {email, password} = req.body;

        await dbCtrl.pool.query(UserSql.post(password, email)).catch((e => {
            return res.status(500)
        }));

        return res.status(201).json({ status: 'success', message: 'User created' })
    });

    return router;
}

export default Users;