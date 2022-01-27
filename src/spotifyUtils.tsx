type MyHash = Record<string, string>;

export function decodeHashString(str: string): MyHash {
    console.log('decoding hash string: ', str)
    return str
        .substring(1)
        .split('&')
        .reduce(function (kvPairs: MyHash, item) {
            if (item) {
                const [k, v] = item.split('=');
                kvPairs[k] = decodeURIComponent(v);
            }
            return kvPairs;
        }, {});
}


export function extractAccessTokenFromLocationHash(hashStr: string) {
    const params = decodeHashString(hashStr);
    return params.access_token;
}