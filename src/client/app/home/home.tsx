import * as React from "react";
import {useEffect, useRef} from "react";
import css from "./home.less"
import {HashRouter, Link, Route, Switch, useHistory, useLocation} from "react-router-dom";
import {Privacy} from "../privacy/privacy";
import {Terms} from "../terms/terms";

import Logo from '../../assets/icons/logo.png';
import Favourites from '../../assets/favourites.png';
import Playlist from '../../assets/playlist.png';
import Intro from '../../assets/intro.png';

import {Button} from "../../ui/button/button";
import {onLogin} from "./login.dialog";
import {onRegister} from "./register.dialog";
import {parseBool} from "../../../utils/function";

export function HomeRouter () {
    const {search, pathname} = useLocation();
    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
        const params = new URLSearchParams(search);
        const value = params.get('login'); // bar
        if(parseBool(value)){
            onLogin(history)
        }
    }, [pathname]);


    return (
        <div className={css.home}>
            <header>
                <div className={css.content}>
                    <div className={css.logo}>
                        <Link to={"/"}>
                            <img alt={"logo"} src={Logo} style={{width: 28}}/><span>Kubo TV</span>
                        </Link>
                    </div>
                    <div className={css.user}>
                        <Button onClick={() => onLogin(history)} text={"Sign in"}/>
                        <Button onClick={onRegister} text={"Join"} type={"primary"}/>
                    </div>
                </div>
            </header>
            <main>
                <HashRouter>
                    <Switch>
                        <Route path="/privacy" children={<Privacy/>}/>
                        <Route path="/terms" children={<Terms/>}/>
                        <Route path="/" children={<Home/>}/>
                    </Switch>
                </HashRouter>
            </main>
            <footer>
                <div className={css.content}>
                    <div>
                        Got any question or feedback? Drop us an email <a href={"mailto:info@kubotv.org"}>info@kubotv.org</a>.
                    </div>
                    <div>
                        <span>Copyright © 2020 | Kubo TV | All rights reserved</span>
                        <div className={css.links}>
                            <Link to={"/privacy"}>Privacy policy</Link>
                            <Link to={"/terms"}>Terms of service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export const Home = () => {
    const infoRef = useRef(null);
    const demoRef = useRef(null);
    const demo2Ref = useRef(null);
    const demo3Ref = useRef(null);


    useEffect(() => {
        const image = document.getElementById("image") as HTMLImageElement;

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            const visible: IntersectionObserverEntry = entries.find(i => i.intersectionRatio > 0.7);

            if(!visible) return;
            const id = visible?.target?.id;

            if(id === "one"){
                image.src = Intro;
            }else if(id === "two"){
                image.src = Favourites;
            }else if(id === "three"){
                image.src = Playlist;
            }
        }, {
            threshold: [0, 1],
        });

        observer.observe(demoRef.current);
        observer.observe(demo2Ref.current);
        observer.observe(demo3Ref.current);
    }, []);


    const onLearnMore = (ev) => {
        infoRef?.current?.scrollIntoView({behavior: "smooth", block: "center"});
    };

    return (
        <>
            <section className={css.intro}>
                <div className={css.content}>
                    <h4>kubo TV</h4>
                    <h1>Your tv, everywhere.</h1>

                    <div className={css.links}>
                        <Button onClick={onLearnMore} type={"primary-dark"}>Learn more</Button>
                    </div>
                </div>
            </section>
            <section className={css.image}>
                <img alt={"info"} src={Intro}/>
            </section>
            <section className={css.info} >
                <p ref={infoRef}>
                    Watch for free your favourite IPTV playlists, anywhere. Your phone, your tv and your pc.
                    There's no limits at Kubo TV, you can add as many playlist as you want, track your favourite channels, customize your playlists, everything in one place!
                </p>
            </section>
            <section className={css.demos} >
                <div className={css.container}>
                    <div className={css.demo}>
                        <p ref={demoRef} id={"one"}>
                            Load your playlists (M3U files) either through a URL or a File and that's it! You should then be able to sit back and enjoy your favourite channels. We should tell you though, that we don't provide any playlist whatsoever we just focus on provide the best IPTV player that you can find.
                        </p>
                    </div>
                    <div className={css.demo}>
                        <p ref={demo2Ref} id={"two"}>
                           Save your favourites with just one click! Wan't to see them all in one place? Just go to the "Favourites" group on the left panel, where you can browse them all together. We guess that's going to be your favourite place! And by the way, you can also browse your recently added channels!
                        </p>
                    </div>
                    <div className={css.demo}>
                        <p ref={demo3Ref} id={"three"}>
                            Any unwanted channel? Just click on "Delete channel" and that's it, your existing channels remain intact. After you loaded a playlist you can customize it as you wan't. Add as many extra playlists as you wan't, delete what you don't wan't, it's up to you!
                        </p>
                    </div>
                </div>
                <div className={css.view}>
                    <img src={Intro} id={"image"} alt={"section1"} className={css.section}/>
                </div>
            </section>
        </>
    )
};
