import {dbCtrl} from "../../db";
import UserSql from "./login.sql";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import {Router} from "express";


const HASH = process.env.HASH;

function Login(router: Router): Router {
    //login
    router.post('/', async (req, res) => {
        const {email, password} = req.body;
        const result = await dbCtrl.pool.query(UserSql.getUserHash(email));
        const {hash} = result.rows[0];
        const isAuthenticated = await bcrypt.compare(password, hash);

        if(!isAuthenticated){
            return res.status(401).json({ status: 'failure', message: 'User unauthorised' })
        }

        const token = await jwt.sign({email, password}, HASH);

        res.header('x-auth', token);

        res.send(200)
    });

    //logout
    router.delete('/', async (req, res) => {
        res.removeHeader('x-auth');
        res.send(200);
    });

    return router;
}

export default Login;