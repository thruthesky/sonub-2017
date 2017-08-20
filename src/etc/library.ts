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
        if (!n) return;
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


    /**
     * 
     * @param s - the string
     * @param n - the positing to cut. if the n'th position is not a blank, then it searches after the n'th position.
     */
    wordcut(s, n = 10) {
        let cut = s.indexOf(' ', n);
        if (cut == -1) return s;
        return s.substring(0, cut)
    }


    strip_tags(input, allowed = '') { // eslint-disable-line camelcase
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
        return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
        })
    }

    /**
     * Returns URL at the beginning of the text.
     *  If the text does not begin with 'http', then it will return false.
     * @param text - text
     */
    getUrlOnTextBegin(text) {
        if (text.length < 14) return false;
        if (text.indexOf('http') === 0) {
            let arr = text.split(/\s+/, 2);
            if (text.indexOf('.') === -1) return false;
            if (arr && arr[0]) return arr[0];
        }
        return false;
    }


    /**
     * Returns Element that has focus.
     * If document.activeElement is not supported, if fallback to querySelector()
     * @note 'document.activeEleemnt' will return 'document.body' If there is no activie element, then it will return null.
     * @return
     *      - HTML Element
     *      - null if no active element.
     * 
     * 
     * @usecase
     * 
     * If you open a ng-bootstrap modal when the cursor(focus) is on input box, 'expression changed' error will occur.
     * To prevent this, you need to remove the focus.
     * 
     * @code
            if ( this.getActiveElement && this.getActiveElement['blur'] ) {
                this.getActiveElement.blur();
            }
     * @endcode
     */
    get getActiveElement(): HTMLElement {
        var focused = document.activeElement;
        if (!focused || focused == document.body)
            focused = null;
        else if (document.querySelector)
            focused = document.querySelector(":focus");
        return <any>focused;
    }
}
