import * as express from 'express';
import {Express, Router} from 'express';
import Users from "./routes/users";
import {_DEV_} from "../../global";

class ExpressCtrl{
    private readonly _app: Express;

    constructor() {
        this._app = express();
        this._init();
    }

    get app(){
        return this._app
    }

    private router = (): Router => {
        const router = express.Router();
        !_DEV_ && router.use(this._browserRestriction);
        return router;
    };

    private _browserRestriction = (req, res, next) => {
        //allow request only if custom header is set
        if(req.headers['bypass']){
            return next();
        }
        res.sendStatus(403)
    };

    private _init = () => {
        const PORT = process.env.PORT || 2000;
        this.app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] === 'https') {
                return res.redirect('http://' + req.hostname + req.url);
            };

            next();
        });

        this.app.use(express.json());

        this.app.use('/users', Users(this.router()));

        this.app.use(express.static('dist'));

        this.app.get('*', (req, res) => {
            res.sendFile('dist/index.html', {root: __dirname})
        });

        this.app.listen(PORT, () => {
            console.log('#### Express server is up on port ' + PORT);
        });
    }
}

export const expressCtrl = new ExpressCtrl();
