export function cls(...args: Array<any>) {
    return args
        .reduce((r, i) => {
            if (i) {
                if (Array.isArray(i)) r.push(cls(...i));
                else if (typeof i == "object") {
                    Object.getOwnPropertyNames(i)
                        .forEach(k => i[k] && r.push(k));
                }
                else if (i !== false) r.push(i);
            }
            return r;
        }, [])
        .join(" ");
}

export function sortBy (collection: Array<any>, iterator: any){
    var isString = typeof iterator === 'string';
    return collection.sort(function(x, y) {
        return isString ? x[iterator] - y[iterator] : iterator(x) - iterator(y);
    });
};