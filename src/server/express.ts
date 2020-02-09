import * as express from 'express';
import {Express} from 'express';
import User from "./routes/user/user";
import Token from "./routes/token/token";
import {_HASH_, _HEADER_AUTH_} from "../../global";
import Login, {verifyToken} from "./routes/login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";
import * as request from "request";
import * as http from "http";

//todo review status codes

class ExpressCtrl{
    private readonly _app: Express;

    constructor() {
        this._app = express();
        this._init();
    }

    get app(){
        return this._app
    }

    // private _browserRestriction = (req, res, next) => {
    //     //allow request only if custom header is set
    //     if(req.headers['bypass']){
    //         return next();
    //     }
    //     res.sendStatus(403)
    // };

    private _authenticate = async (req, res, next) => {
        let token = req.header(_HEADER_AUTH_);

        // if(!token){
        //     token = localStorage.getItem(_TOKEN_lOCALS_);
        // }

        if(!token) return res.redirect("/");

        const decoded = await verifyToken(token, _HASH_);

        if(!decoded) return res.redirect("/");

        next()
    };

    private _init = () => {
        const PORT = process.env.PORT;
        this.app.use((req, res, next) => {
            if (req.protocol === 'https') {
                return res.redirect('http://' + req.hostname + req.url);
            };

            next();
        });

        this.app.use(express.json());

        this.app.post('/user', User.verifyEmail);
        this.app.get('/user/:token', User.insert);

        this.app.post('/login', Login.login);
        this.app.delete('/login', Login.logout);

        this.app.post('/verify/:token', Token.verify);
        this.app.get('/proxy/*', (req: Request, res: Response, next: NextFunction) => {
            const u = req.params[0];
            // let u = decodeURIComponent(url);
            res.header("Access-Control-Allow-Origin", "*");
            // req.url = u;


            //
            // if(u.startsWith("chunk") || u.startsWith("media")){
            //     u = "http://193.126.16.68:1935/livenlin4/mp4:2liveartvpub/" + u;
            // }

            console.log(u);


            request.get(u).pipe(res);
        });

        this.app.use(express.static('dist'));


        this.app.get('/:route', (req, res, next) => {
            const {route} = req.params;

            const excludes = ["proxy"];

            if(!excludes.includes(route)){
                return res.sendFile('dist/index.html', {root: __dirname})
            }

            next()
        });

        this.app.listen(PORT, () => {
            console.log('#### Express server is up on port ' + PORT);
        });
    }
}

export const expressCtrl = new ExpressCtrl();
