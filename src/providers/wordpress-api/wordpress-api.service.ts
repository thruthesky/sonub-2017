import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';



import { Base } from '../../etc/base';

import { error, ERROR } from './../../etc/error';

import { getLanguage, setLanguage } from './../../etc/language';




// import { } from './interface';

import 'rxjs/add/operator/map';



@Injectable()
export class WordpressApiService extends Base {

    private url: string;// =  environment.xapiUrl;
    constructor(
        private domSanitizer: DomSanitizer,
        private http: HttpClient,
        private ngZone: NgZone
    ) {
        super();
        this.url = this.xapiUrl();
    }

    // getPosts() {
    //     // return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    // }

    post(data): Observable<any> {
        return this.http.post(this.url, data)
            .map(e => this.checkResult(e, data))
            .map(e => {
                setTimeout(() => this.ngZone.run(() => { }), 100); // redraw the page. Angular is not 100% redraw when XHR is done.
                return e;
            })
    }


    checkResult(res, data) {
        // console.log("res: ", res);
        if (!res) {
            console.error("Response from backend is empty");
            console.log("Requested data(that cause empty response): ", data);
            throw error(ERROR.RESPONSE_EMPTY);
        }
        else if (res['code'] === void 0) throw error(ERROR.RESPONSE_NO_CODE);
        else if (res['code'] !== 0) {
            // console.log("WordPressApiService::checkResult => error : ", res);
            throw error(res['code'], res['message']);
        }
        else return res['data'];
    }

    query(req): Observable<any> {
        req['route'] = 'wordpress.wp_query';
        req['paged'] = req['paged'] ? req['paged'] : 1;
        return this.post(req);
    }

    /**
     * Gets text from server.
     * @param codes codes
     * @param callback callback
     */
    text(codes: Array<string>, callback): void {

        if (!codes || !codes.length) callback();

        let req = {};
        req['route'] = 'wordpress.text';
        req['codes'] = codes;
        req['ln'] = getLanguage();

        let key = codes.join('');
        let cache = this.getCache(key);
        if (cache) callback(cache);
        // this.getCache( key );
        // this.setCache( code.join(), )
        this.post(req).subscribe(re => {
            callback(re);
            this.setCache( key, re );
        }, e => console.error(e));
    }



}
