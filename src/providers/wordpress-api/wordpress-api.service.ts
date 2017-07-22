import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

import { Observable } from 'rxjs/Observable';

import { Base } from '../../etc/base';



import {
    SOCIAL_PROFILE, USER_REGISTER, USER_REGISTER_RESPONSE, USER_LOGIN, USER_LOGIN_RESPONSE,
    USER_UPDATE, USER_UPDATE_RESPONSE, USER_DATA, USER_DATA_RESPONSE
} from './interface';

import 'rxjs/add/operator/map';



@Injectable()
export class WordpressApiService extends Base {

    private url: string = environment.xapiUrl;
    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // getPosts() {
    //     // return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    // }

    post(data): Observable<any> {
        // console.log("Url: ", this.url , JSON.stringify( data ) );
        return this.http.post(this.url, data)
            .map(e => this.checkResult(e));
    }


    checkResult(res) {
        if (!res) throw this.error('response-is-empty');
        // if ( res.code === void 0 ) throw this.error('code-does-not-exist-in-response');
        if (res['code'] !== void 0) throw this.error(res['code'], res['message']);
        return res;
    }

    
}
