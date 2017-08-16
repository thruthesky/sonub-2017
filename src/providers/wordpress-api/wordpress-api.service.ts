import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

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
        private http: HttpClient
    ) {
        super();
        this.url = this.xapiUrl();
    }

    // getPosts() {
    //     // return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    // }

    post(data): Observable<any> {
        return this.http.post(this.url, data)
            .map(e => this.checkResult(e, data));
    }


    checkResult(res, data) {
        // console.log("res: ", res);
        if (!res) {
            console.error("Response from backend is empty");
            console.log("Requested data(that cause empty response): ", data);
            throw error(ERROR.RESPONSE_EMPTY);
        }
        else if (res['code'] === void 0) throw error(ERROR.RESPONSE_NO_CODE);
        else if (res['code'] !== 0) throw error(res['code'], res['message']);
        else return res['data'];
    }

    query(req): Observable<any> {
        req['route'] = 'wordpress.wp_query';
        req['paged'] = req['paged'] ? req['paged'] : 1;
        return this.post(req);
    }


    page(pageName: string) {
        let url = this.serverUrl + '/wp-content/plugins/xapi-2/pages/page.php?name=' + pageName + '&ln=' + getLanguage();
        console.log('page: ', url);
        return this.http.get(url, { responseType: 'text' })
            .map(e => this.domSanitizer.bypassSecurityTrustHtml(e) as string);
    }





}
