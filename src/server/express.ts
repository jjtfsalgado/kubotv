import * as express from 'express';
import {Express} from 'express';
import User from "./routes/user/user";
import Channel from "./routes/channel/channel";
import Playlist from "./routes/playlist/playlist";
import Token from "./routes/token/token";
import {_HASH_, _HEADER_AUTH_} from "../../global";
import Login, {verifyToken} from "./routes/login/login";
import {NextFunction, Request, Response} from "express-serve-static-core";
import compression from "compression";

const HttpProxy = require('http-proxy');
const proxy = HttpProxy.createProxyServer({changeOrigin: true, ignorePath: true, cookieDomainRewrite: {"*": ""}});

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
        this.app.use(compression())
        this.app.use(express.urlencoded({limit: '10mb', extended: true}))
        this.app.use(express.json({limit: '10mb'}));
        this.app.use(express.json());

        this.app.post('/user', User.verifyEmail);
        this.app.get('/user/:token', User.insert);

        this.app.get('/playlist/:userId', this._authenticate, Playlist.get);
        this.app.get('/playlist/groups/:userId/:playlistId', this._authenticate, Playlist.getGroups);

        this.app.get('/favourite/:userId', this._authenticate, Channel.getFavourites);
        this.app.get('/favourite/total/:userId', this._authenticate, Channel.getFavouritesTotal);
        this.app.patch('/favourite', this._authenticate, Channel.updateFavourites);


        this.app.post('/channel/:userId', this._authenticate, Channel.insert);
        this.app.get('/channel/:userId/:playlistId', this._authenticate, Channel.get);
        this.app.get('/channel/total/:userId/:playlistId', this._authenticate, Channel.getTotal);
        this.app.delete('/channel/:channelId&:userId', this._authenticate, Channel.delete);
        this.app.delete('/channel/view/:view&:userId', this._authenticate, Channel.deleteView);

        this.app.post('/login', Login.login);
        this.app.delete('/login', Login.logout);

        this.app.post('/verify/:token', Token.verify);
        this.app.get('/proxy/*', (req: Request, res: Response, next: NextFunction) => {
            const groups = req.originalUrl.match(/(?<=\/proxy\/).*$/g);
            if(!groups){
                throw new Error("Invalid url")
            }

            const url = groups[0]
            res.header("Access-Control-Allow-Origin", "*");
            try{
                return proxy.web(req, res, {target: url}, next);
            }catch (e) {
                console.log(e)
            }
        });

        this.app.use(express.static('dist'));

        this.app.listen(PORT, () => {
            console.log('#### Express server is up on port ' + PORT);
        });
    }
}

export const expressCtrl = new ExpressCtrl();
