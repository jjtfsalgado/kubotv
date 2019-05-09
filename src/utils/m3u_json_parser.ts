function m3utojson(m3u) {
    return m3u
        .replace('#EXTM3U', '')
        .split('#EXTINF:0,')
        .slice(1)
        .map(function(str, index) {
            var channel = str.split('\n').slice(0,-1);

            return {
                "id": index + 1,
                "number": index + 1,
                "title": channel[0],
                "tv_logo": "",
                "tv_categories": [2],
                "streaming_url": channel[1],
                "announce": "",
                "volume_shift": 0
            };
        });
}


var parseM3U = m3utojson(playlist) ;