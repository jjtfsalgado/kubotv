import * as express from 'express';
import {Express} from 'express';
import User from "./routes/user/user";
import Channel from "./routes/channel/channel";
import Token from "./routes/token/token";
import {_HASH_, _HEADER_AUTH_} from "../../global";
import Login, {verifyToken} from "./routes/login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";
import * as request from "request";

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

    private _authenticate = async (req, res, next) => {
        let token = req.header(_HEADER_AUTH_);

        if(!token) return res.sendStatus(500);

        const decoded = await verifyToken(token, _HASH_);

        if(!decoded) return res.sendStatus(500);

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

        this.app.get('/channel/:userId', this._authenticate, Channel.get);
        this.app.post('/channel', this._authenticate, Channel.insert);

        this.app.post('/login', Login.login);
        this.app.delete('/login', Login.logout);

        this.app.post('/verify/:token', Token.verify);
        this.app.get('/proxy/*', (req: Request, res: Response, next: NextFunction) => {
            const u = req.params[0];
            res.header("Access-Control-Allow-Origin", "*");
            request.get(u).pipe(res);
        });

        this.app.use(express.static('dist'));

        this.app.listen(PORT, () => {
            console.log('#### Express server is up on port ' + PORT);
        });
    }
}

export const expressCtrl = new ExpressCtrl();
