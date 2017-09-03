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
     * Returns true if the app is running as Cordova mobile app.
     */
    get isCordova(): boolean {
        if (window['cordova']) return true;
        if (document.URL.indexOf('http://') === -1
            && document.URL.indexOf('https://') === -1) return true;
        return false;
    }

    get isWeb(): boolean {
        if (document.URL.indexOf('http://') != -1
            || document.URL.indexOf('https://') != -1) return true;
        else return false;
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




    http_build_query(formdata, numericPrefix = '', argSeparator = '') {
        var urlencode = this.urlencode;
        var value
        var key
        var tmp = []
        var _httpBuildQueryHelper = function (key, val, argSeparator) {
            var k
            var tmp = []
            if (val === true) {
                val = '1'
            } else if (val === false) {
                val = '0'
            }
            if (val !== null) {
                if (typeof val === 'object') {
                    for (k in val) {
                        if (val[k] !== null) {
                            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                        }
                    }
                    return tmp.join(argSeparator)
                } else if (typeof val !== 'function') {
                    return urlencode(key) + '=' + urlencode(val)
                } else {
                    throw new Error('There was an error processing for http_build_query().')
                }
            } else {
                return ''
            }
        }

        if (!argSeparator) {
            argSeparator = '&'
        }
        for (key in formdata) {
            value = formdata[key]
            if (numericPrefix && !isNaN(key)) {
                key = String(numericPrefix) + key
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator)
            if (query !== '') {
                tmp.push(query)
            }
        }

        return tmp.join(argSeparator)
    }
    protected urlencode(str) {
        str = (str + '')
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    }


    /**
     * 
     * @param a 
     * @return Objects of params
     * 
     * @code
     *  let params = this.queryString();
     *  params['abc'];
     * @endcode
     */
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
     * Returns URL at the beginning of the text. ( 입력된 text 의 첫 부분에서 URL 을 리턴한다.)
     * @note If the text does not begin with 'http', then it will return false. ( 만약 첫 부분이 http 로 시작하지 않으면 false 를 리턴한다. )
     * @param text - text
     */
    getUrlOnTextBegin(text) {
        if (text.length < 14) return false;
        text = text.trim();
        if (text.indexOf('http') === 0) {
            let arr = text.split(/\s+/, 2);
            if (text.indexOf('.') === -1) return false;
            if (arr && arr[0]) return arr[0];
        }
        return false;
    }
    /**
     * 
     * getUrlOnTextBegin() 이 text 앞 부분에서 URL 을 가져온다면,
     * getUrlOnText() 는 text 에서 맨 처음 나타나는 URL 을 리턴한다.
     * http:// 또는 https:// 로 시작하고, 문자가 있으면 URL 로 인식한다.
     * 
     * @param text
     * 
     * @return URL 이 없으면 null, 있으면 URL 을 리턴한다.
     * 
     * @tests - Below are test.
     
        "abc"         ===> null
        "abc def http"         ===> null
        "abc http://www.com "         ===> http://www.com
        "https:// philgo.com abc"         ===> null
        "https://philgo.com abc"         ===> https://philgo.com
        " https://philgo.com abc"         ===> https://philgo.com
        "  abc http://www.philgo.com?qna&idx=123"         ===> http://www.philgo.com?qna&idx=123
        "  http://jjj http://www.philgo.com?qna&idx=123"         ===> http://jjj
        "  https:// http:// http://www.philgo.com#/#/push-id&a=b "         ===> http://www.philgo.com#/#/push-id&a=b

     * @end of tests
     */
    getUrlOnText(text) {
        let re = text.match(/https?:\/\/[^\s]+/);
        if (re) return re[0];
        return null;
    }
    /**
     * 입력된 문자열 text 에서 최대 len 길이 만큼 문자열을 리턴한다.
     * @note 이 문자열은 주로 제목으로 쓰인다. 물론 다른 용도로 사용 가능하다.
     * 
     * @logic
     *      1. 빈 문자열이거나 공백 문자열이면 '' 를 리턴한다.
     *      2. 첫 부분 문자열이 URL 이면, '' 을 리턴한다.
     *      3. text 의 전체 글 수가 10자 이하이면, '' 를 리턴한다.
     * 
     * @note 위 조건에서는 text 맨 처음에 URL 이 있으면 안되지만, 중간부터는 된다. 예를 들면,
     *      아래와 같은 경우, URL 이 리턴된다.
     *      "처음에 URL 주소는 안되지만, https://www.philgo.com/?1273358785"
     * 
     * @param text 문자열
     */
    getTitleOnTextBegin(text, len = 60) {
        if (!text) return '';
        text = text.trim(); /// // text = text.replace(/^\s+|\s+$/gm,''); // trim for old browsers.
        text = text.replace(/\s+/g, " "); // make multi-lines into one line.
        if (!text) return '';
        if (text.length < 10) return '';
        if (text.indexOf('http') === 0) return '';
        return this.wordcut(text, 60);
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


    /**
     * text 를 입력 받고 그 안의 URL 을 HTML A 태그로 변환한다.
     * 이 함수는 완벽하지는 않지만, 그럭 저럭 사용 가능 하다. 많은 라이브러리가 존재하지만 그 크기가 20Kb 이상인 것이 많다.
     * 
     * @param text 
     * @return text - 리턴되는 TEXT 에는 URL 이 <a href='...' target='_blank'>URL<a> 로 변경되어져 있다.
     */
    autoLink(text) {
        var re = /(\(.*?)?\b((?:https?|ftp|file):\/\/[-a-z0-9+&@#\/%?=~_()|!:,.;]*[-a-z0-9+&@#\/%=~_()|])/ig;
        return text.replace(re, function (match, lParens, url) {
            var rParens = '';
            lParens = lParens || '';

            // Try to strip the same number of right parens from url
            // as there are left parens.  Here, lParenCounter must be
            // a RegExp object.  You cannot use a literal
            //     while (/\(/g.exec(lParens)) { ... }
            // because an object is needed to store the lastIndex state.
            var lParenCounter = /\(/g;
            while (lParenCounter.exec(lParens)) {
                var m;
                // We want m[1] to be greedy, unless a period precedes the
                // right parenthesis.  These tests cannot be simplified as
                //     /(.*)(\.?\).*)/.exec(url)
                // because if (.*) is greedy then \.? never gets a chance.
                if (m = /(.*)(\.\).*)/.exec(url) ||
                    /(.*)(\).*)/.exec(url)) {
                    url = m[1];
                    rParens = m[2] + rParens;
                }
            }
            return lParens + "<a href='" + url + "' target='_blank'>" + url + "</a>" + rParens;
        });
    }

    /**
     * New line to <br> tag.
     * @note it is coming from locutus.io
     * @param str 
     * @param isXhtml 
     */
    nl2br(str, isXhtml = false) {
        //   example 1: nl2br('Kevin\nvan\nZonneveld')
        //   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
        //   example 2: nl2br("\nOne\nTwo\n\nThree\n", false)
        //   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
        //   example 3: nl2br("\nOne\nTwo\n\nThree\n", true)
        //   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
        //   example 4: nl2br(null)
        //   returns 4: ''
        // Some latest browsers when str is null return and unexpected null value
        if (typeof str === 'undefined' || str === null) {
            return ''
        }
        // Adjust comment to avoid issue on locutus.io display
        var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>'
        return (str + '')
            .replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1')
    }


    /**
     * 
     * @param text 
     * @param o 
     */
    htmlify(text, o = {}) {

        if (o && o['autolink']) text = this.autoLink(text);
        if (o && o['nl2br']) text = this.nl2br(text);


        return text;
    }


    /**
     * Returns the object of HTML Event
     * @param obj HTML Event
     */
    getTarget(obj) {
        var targ;
        var e=obj;
        if (e.target) targ = e.target;
        else if (e.srcElement) targ = e.srcElement;
        if (targ.nodeType == 3) // defeat Safari bug
            targ = targ.parentNode;
        return targ;
    }

}
