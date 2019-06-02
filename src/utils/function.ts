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

export function debounce(func, context?, ms = 50, immediate = false): any {
    let timeout;
    return function (...args) {
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
        if (callNow) func.apply(context, args);
    };
}

export async function readFile(file: any){
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            res(nullProp(e.target, (i: any) => i.result));
        };
        reader.readAsText(file);
    })
}

export function sortByMany<T>(arr: Array<T>, ...sorts: Array<(i: T) => any>): void {
    const sorter = (a, b) => {
        for (const s of sorts) {
            let va, vb;
            va = undefault(s.call(arr, a), null);
            vb = undefault(s.call(arr, b), null);

            if (va === vb) {
                continue; // skip to next
            }

            if (va > vb || vb === null) {
                if (vb == null) return -1;
                return 1;
            }

            if (va < vb || va === null) {
                if (va == null) return 1;
                return -1;
            }
        }
        return 0;
    };
    arr.sort(sorter);
}

export function undefault(val, def) {
    return val === undefined ? def : val;
}