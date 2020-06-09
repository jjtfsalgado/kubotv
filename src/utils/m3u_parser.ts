import {IChannel} from "../client/controllers/playerCtrl";

declare global {
    interface String {
        getAttribute(length : number) : string;
        getName(length : number) : string;
        getVlcOption(length : number) : string;
        getURL(length : number) : string;
    }
}


export function m3uToJson(str: string): Array<IChannel> {
    //fixme catch incorrect playlist
    const parsedManifest = parse(str);

    return parsedManifest?.items.map( i => ({url: i.url , description: i.name, logo_url: i.tvg?.logo, group_title: i.group?.title}))
}


function parse (content) {
    let playlist = {
        header: {},
        items: [],
    }

    let manifest = content.split(/(?=#EXTINF)/).map((l) => l.trim())

    const firstLine = manifest.shift()

    if (!firstLine || !/#EXTM3U/.test(firstLine)) throw new Error('Playlist is not valid')

    playlist.header = parseHeader(firstLine)

    for (let line of manifest) {
        const item = {
            name: line.getName(),
            tvg: {
                id: line.getAttribute('tvg-id'),
                name: line.getAttribute('tvg-name'),
                language: line.getAttribute('tvg-language'),
                country: line.getAttribute('tvg-country'),
                logo: line.getAttribute('tvg-logo'),
                url: line.getAttribute('tvg-url'),
            },
            group: {
                title: line.getAttribute('group-title') || null,
            },
            http: {
                referrer: line.getVlcOption('http-referrer'),
                'user-agent': line.getVlcOption('http-user-agent'),
            },
            url: line.getURL(),
            raw: line,
        }

        playlist.items.push(item)
    }

    return playlist
}

function parseHeader(line) {
    const supportedAttrs = ['x-tvg-url']

    let attrs = {}
    for (let attrName of supportedAttrs) {
        const tvgUrl = line.getAttribute(attrName)
        if (tvgUrl) {
            attrs[attrName] = tvgUrl
        }
    }

    return {
        attrs,
        raw: line,
    }
}


String.prototype.getAttribute = function (name) {
    let regex = new RegExp(name + '="(.*?)"', 'gi')
    let match = regex.exec(this)

    return match && match[1] ? match[1] : ''
}

String.prototype.getName = function () {
    let name = this.split('\n').shift().split(',').pop()

    return name || ''
}

String.prototype.getVlcOption = function (name) {
    let regex = new RegExp('#EXTVLCOPT:' + name + '=(.*?)\\n', 'gi')
    let match = regex.exec(this)

    return match && match[1] ? match[1] : ''
}

String.prototype.getURL = function () {
    const supportedTags = ['#EXTVLCOPT', '#EXTINF']
    const last = this.split('\n')
        .filter((l) => l)
        .map((l) => l.trim())
        .filter((l) => {
            return supportedTags.every((t) => !l.startsWith(t))
        })
        .shift()

    return last || ''
}
