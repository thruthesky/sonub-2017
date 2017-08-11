import { ERROR } from './error';

export class Library {

    randomString() {
        let d = new Date();
        let unique = d.getTime() + '_';
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 8; i++) {
            unique += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return unique;
    }





    /**
     * .set() automatically JSON.stringify()
     * .get() automatically JSON.parse()
     *
     * @return .get() returns null if there is error or the value is falsy.
     *
     */
    get storage() {
        return {
            get: (key) => {
                let value = localStorage.getItem(key);
                if (value) {
                    try {
                        return JSON.parse(value);
                    }
                    catch (e) {
                        return null;
                    }
                }
                return null;
            },
            set: (key, data) => {
                // console.log("storage::set()", data);
                return localStorage.setItem(key, JSON.stringify(data));
            }
        }
    }



    /**
     * Returns true if the app is running on Mobile as Cordova mobile app.
     */
    get isCordova(): boolean {
        if (window['cordova']) return true;
        if (document.URL.indexOf('http://') === -1
            && document.URL.indexOf('https://') === -1) return true;
        return false;
    }





    // /**
    //  * Returns the body of POST method.
    //  *
    //  * @attention This addes 'module', 'submit'. If you don't needed just user http_build_query()
    //  *
    //  * @param params must be an object.
    //  */
    // protected buildQuery(params) {
    //     // params[ 'module' ] = 'ajax'; // 'module' must be ajax.
    //     // params[ 'submit' ] = 1; // all submit must send 'submit'=1
    //     return this.http_build_query(params);
    // }




    // protected http_build_query(formdata, numericPrefix = '', argSeparator = '') {
    //     var urlencode = this.urlencode;
    //     var value
    //     var key
    //     var tmp = []
    //     var _httpBuildQueryHelper = function (key, val, argSeparator) {
    //         var k
    //         var tmp = []
    //         if (val === true) {
    //             val = '1'
    //         } else if (val === false) {
    //             val = '0'
    //         }
    //         if (val !== null) {
    //             if (typeof val === 'object') {
    //                 for (k in val) {
    //                     if (val[k] !== null) {
    //                         tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
    //                     }
    //                 }
    //                 return tmp.join(argSeparator)
    //             } else if (typeof val !== 'function') {
    //                 return urlencode(key) + '=' + urlencode(val)
    //             } else {
    //                 throw new Error('There was an error processing for http_build_query().')
    //             }
    //         } else {
    //             return ''
    //         }
    //     }

    //     if (!argSeparator) {
    //         argSeparator = '&'
    //     }
    //     for (key in formdata) {
    //         value = formdata[key]
    //         if (numericPrefix && !isNaN(key)) {
    //             key = String(numericPrefix) + key
    //         }
    //         var query = _httpBuildQueryHelper(key, value, argSeparator)
    //         if (query !== '') {
    //             tmp.push(query)
    //         }
    //     }

    //     return tmp.join(argSeparator)
    // }



    // protected urlencode(str) {
    //     str = (str + '')
    //     return encodeURIComponent(str)
    //         .replace(/!/g, '%21')
    //         .replace(/'/g, '%27')
    //         .replace(/\(/g, '%28')
    //         .replace(/\)/g, '%29')
    //         .replace(/\*/g, '%2A')
    //         .replace(/%20/g, '+')
    // }


    queryString(a?) {
        if (!a) {
            if (!window.location.search) return {};
            if (window.location.search.length == 0) return {};
            a = window.location.search.substr(1).split('&');
        }

        var b = {};
        for (var i = 0; i < a.length; ++i) {

            try {
                var p = a[i].split('=', 2);
                if (p.length == 1)
                    b[p[0]] = "";
                else
                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            catch (e) { }
        }
        return b;
    }


    add0(n: number): string {
        if( !n ) return;
        return n < 10 ? '0' + n : n.toString();
    }


    shortDate(stamp) {

        let d = new Date(stamp * 1000);
        let today = new Date();

        let dt = '';
        if (d.getFullYear() == today.getFullYear() && d.getMonth() == today.getMonth() && d.getDate() == today.getDate()) {
            dt = d.toLocaleString();
            dt = dt.substring(dt.indexOf(',') + 2).toLowerCase();
            dt = dt.replace(/\:\d\d /, ' ');
        }
        else {
            dt = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        }
        return dt;
    }

    // getTimezoneOffset(): string {
    //     let offset = '';
    //     try {
    //         var objdatetime = new Date();
    //         var timezone = objdatetime.toTimeString();
    //         var tzstr = timezone.split("(");
    //         offset = tzstr[1].toString().replace(")", "");
    //     }
    //     catch (e) { };
    //     return offset;
    // }
}
