import * as React from 'react';
import {ReactNode, useEffect, useState} from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {HomeRouter} from "./home/home";
import css from "./app.less";
import localStorageCtrl from "../controllers/localhost";
import axios from "axios";
import {_HEADER_AUTH_} from "../../../global";
import {BusyImport, Spinner} from "../ui/busy/busy";

export function App() {
    const [busy, setBusy] = useState(true);

    const callback = () => {
        setBusy(false)
    };

    useEffect(() => {
        axios.defaults.headers.common[_HEADER_AUTH_] = localStorageCtrl.tokenGet;

        window.addEventListener("load", callback);
        return () => window.removeEventListener("load", callback);

    },[]);

    if(busy){
        return <Spinner/>
    }

    return (
        <div className={css.app}>
            <HashRouter>
                <Switch>
                    <PrivateRoute path="/player" children={<PlayerLazy/>}/>
                    <Route path="/" children={<HomeRouter/>}/>
                </Switch>
            </HashRouter>
        </div>
    )
}

const PlayerLazy = () => {
    return (
        <BusyImport load={() => import("./player/player")}>
            {(Player) => <Player/>}
        </BusyImport>
    )
};

async function verifyToken(token: string): Promise<boolean>{
    const response = await axios.post(`/verify/${token}`);
    return response.data
}

function PrivateRoute({ children, ...rest }) {
    const [isAuthenticated, setAuthentication] = useState(null);

    useEffect( () => {
        (async () => {
            try{
                const token = localStorageCtrl.tokenGet;
                const isVerified = token ? await verifyToken(token) : false;
                setAuthentication(isVerified);
            }catch (e) {
                setAuthentication(false);
            }
        })()
    }, []);

    if(isAuthenticated == null) return <Spinner/>;

    return (
        isAuthenticated ? <Route {...rest}>{children}</Route> : <Redirect to={{pathname: "/login"}}/>
    );
}




