import {newGuid} from "./function";

const regex = /#EXTINF:(.+?)[,]\s?(.+?)[\r\n]+?((?:https?|rtmp):\/\/(?:\S*?\.\S*?)(?:[\s)\[\]{};"\'<]|\.\s|$))/gm;
const regexAttr = /([a-zA-Z0-9\-\_]+?)="([^"]*)"/gm;

export function m3uToJson(str: string) {
    let match;
    const data = [];

    while(match = regex.exec(str)){
        const obj = {
            title: match[2],
            url: match[3].trim(),
            id: newGuid(),
            favorite: false
        };

        const attrs = match[1].match(regexAttr);
        const r = attrs && attrs.reduce((accum: any, value) => {
            const at = value.split('=');
            accum[at[0]] = at[1];
            return accum;
        }, {});

        data.push(Object.assign(obj, r))
    }

    return data;
}
