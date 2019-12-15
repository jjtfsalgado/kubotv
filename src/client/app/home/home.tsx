import * as React from "react";

import {ToolBar} from "../../ui/toolbar/toolbar";
import css from "./home.less"
import {Link} from "react-router-dom";

export function Home () {
    return (
        <div className={css.home}>
            <ToolBar className={css.toolbar}>
                <div>This my logo</div>
                <Link to={"/login"}>Login</Link>
                <Link to={"/register"}>Sign up</Link>
            </ToolBar>
            <div className={css.content}>
                <div className={css.welcome}>
                    <div className={css["welcome-content"]}>
                        <h4>IPTV</h4>
                        <h1>Your tv, everywhere.</h1>
                        <div className={css.links}>
                            <a>Watch now</a><a>Learn more yey</a>
                        </div>
                    </div>
                </div>

                Hey this is my homepage


            </div>
        </div>
    )
}