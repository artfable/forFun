/**
 * @author artfable
 * 22.02.16
 */

/**
 * Not use AMD, because I want to use 'export' from es6, that not supported yet((
 * Now just set to root (window | self | global). If you would like to change it, don't forgot that it use underscoreJS))
 */
;
(function(factory) {
    var root = (typeof window == 'object' && window.window == window && window)
        || (typeof self == 'object' && self.self == self && self)
        || (typeof global == 'object' && global.global == global && global);
    factory(root);
})(function(root) {
    'use strict';

    /**
     * Sieve of Eratosthenes
     *
     * @param num
     * @returns {Array}
     */
    let eratosfen = function(num) {
        if (num < 2) {
            throw 'Num must be more than 2';
        }

        let notSimple = [];
        for (let i = 2; i < num; i++) {
            if (!notSimple[i]) {
                for (let simple = 2 * i; simple < num; simple += i) {
                    notSimple[simple] = true;
                }
            }
        }


        let result = [];
        for (let i = 2; i < num; i++) {
            if (!notSimple[i]) {
                result.push(i);
            }
        }


        return result;
    };

    /**
     * Not my, I just take it somewhere))
     * @param m
     * @param n
     * @returns {number}
     */
    let nod = function(m, n) {
        let a = m;
        let b = n;
        let m1 = 1;
        let n1 = 0;
        let m2 = 0;
        let n2 = 1;

        while (b != 0) {
            let r = a % b;
            let q = (a - r) / b;
            a = b;
            b = r;
            let t = m1 - q * m2;
            m1 = m2;
            m2 = t;
            t = n1 - q * n2;
            n1 = n2;
            n2 = t;
        }

        return (m1 > 0 ? m1 : n1);
    };

    /**
     * Algorithm take from https://ru.wikipedia.org/wiki/RSA
     *
     * @returns {*}
     */
    let keysGen = function() {
        let arr = _.sample(eratosfen(10000), 2);
        let n = arr[0] * arr[1];
        let yn = (arr[0] - 1) * (arr[1] - 1);
        let e = _.sample(eratosfen(yn));
        let d = nod(e, yn);
        if (d * e % yn != 1) {
            return keysGen();
        }
        return {e: e, d: d, n: n};
    };

    /**
     * Modulo operation.
     * Divide a by b with modulo.
     *
     * @param a
     * @param b
     * @param mod
     * @returns {number}
     */
    let powMod = function(a, b, mod) {
        let res = 1;
        for (let i = 0; i < b; i++) {
            res *= a;
            res %= mod;
        }
        return res;
    };

    /**
     * Additional, not rsa encrypt algorithm
     *
     * @param arr
     * @returns {string}
     */
    let encrypt = function(arr) {
        let result = '';
        _.each(arr, function(num) {
            let str = String(num);
            _.each(str, function(c) {
                result += String.fromCharCode(c.charAt(0) + 97)
            });
            result += String.fromCharCode(666);
        });
        return result;
    };

    /**
     * Decrypt for {@link encrypt}
     *
     * @param str
     * @returns {Array}
     */
    let decrypt = function(str) {
        let result = [];
        let buf = '';
        _.each(str, function(c) {
            let code = c.charCodeAt(0);
            if (code != 666) {
                buf += (code - 97) / 100;
            } else {
                result.push(parseInt(buf));
                buf = '';
            }
        });
        return result;
    };

    root.RSA = function(outKey) {
        let key = (outKey ? outKey : keysGen());
        return {
            /**
             * Don't tell it to anyone!!)))
             *
             * @returns {{d: (number|d|*), e: (e|*), n: (number|n|*)}}
             */
            getFullKey: function() {
                return {d: key.d, e: key.e, n: key.n}
            },
            /**
             * Just for encrypt, you can give it to anyone))
             * @returns {{e: (e|*), n: (number|n|*)}}
             */
            getOpenKey: function() {
                return {e: key.e, n: key.n};
            },
            encrypt: function(str) {
                let result = [];
                for (let i = 0; i < str.length; i++) {
                    result.push(powMod(str.charCodeAt(i), key.e, key.n));
                }
                return encrypt(result);
            },
            decrypt: function(arr) {
                if (!key.d) {
                    throw 'Unavailable, only open key';
                }
                arr = decrypt(arr);
                let str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += String.fromCharCode(powMod(arr[i], key.d, key.n));
                }
                return str;
            }
        }
    };
});