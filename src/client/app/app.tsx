import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import {HomeRouter} from "./home/home";
import css from "./app.less";
import localStorageCtrl from "../controllers/localhost";
import axios from "axios";
import {_HEADER_AUTH_} from "../../../global";
import {BusyImport, Spinner} from "../ui/busy/busy";

export function App() {
    const history = useHistory();

    useEffect(() => {
        axios.defaults.headers.common[_HEADER_AUTH_] = localStorageCtrl.tokenGet;
        document.getElementById("loading").style.display = "none";

        history.listen((location, action) => {
            const locationEvent = new CustomEvent("location-change", { detail: {location, action}});
            document.dispatchEvent(locationEvent);
        });

    },[]);

    return (
        <div className={css.app}>
            <Switch>
                <PrivateRoute path="/player" children={<PlayerLazy/>}/>
                <Route path="/" children={<HomeRouter/>}/>
            </Switch>
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




