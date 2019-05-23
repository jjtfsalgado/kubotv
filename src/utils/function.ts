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

export function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Null propagation
// C#:   a?.b?.c?.d? ?? default		=>	nullProp(a, i=>i.b, i=>i.c, i=>i.d) || default
export function nullProp<A, B>(a: A, b: (b: A) => B): B;
export function nullProp<A, B, C>(a: A, b: (b: A) => B, c: (c: B) => C): C;
export function nullProp<A, B, C, D>(a: A, b: (b: A) => B, c: (c: B) => C, d: (d: C) => D): D;
export function nullProp<A, B, C, D, E>(a: A, b: (b: A) => B, c: (c: B) => C, d: (d: C) => D, e: (e: D) => E): E;
export function nullProp<A, B, C, D, E, F>(a: A, b: (b: A) => B, c: (c: B) => C, d: (d: C) => D, e: (e: D) => E, f: (f: E) => F): F;
export function nullProp<A, B, C, D, E, F, G>(a: A, b: (b: A) => B, c: (c: B) => C, d: (d: C) => D, e: (e: D) => E, f: (f: E) => F, g: (g: F) => G): G;
export function nullProp<A, B, C, D, E, F, G, H>(a: A, b: (b: A) => B, c: (c: B) => C, d: (d: C) => D, e: (e: D) => E, f: (f: E) => F, g: (g: F) => G, h: (h: G) => H): H;
export function nullProp(p: any, ...props: Array<((i: any) => any)>): any {
    let t = p;
    for (let i = 0; i < props.length; i++) {
        if (!t) return;
        t = props[i](t);
    }
    return t;
}

export async function readFile(file: any): string{
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            res(nullProp(e.target, (i: any) => i.result));
        };
        reader.readAsText(file);
    })
}