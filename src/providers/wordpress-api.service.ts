import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

import { Observable } from 'rxjs/Observable';

import { Base } from './base';


import {
    USER_REGISTER, USER_REGISTER_RESPONSE,
    USER_LOGIN, USER_LOGIN_RESPONSE
} from './user.service';
import 'rxjs/add/operator/map';



@Injectable()
export class WordpressApiService extends Base {

    private url: string = environment.xapiUrl;
    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getPosts() {
        return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    }

    post( data ): Observable<any> {
        return this.http.post( this.url, data )
            .map( e => this.checkResult(e) );
    }
    register( data: USER_REGISTER ): Observable<USER_REGISTER_RESPONSE> {
        data['route'] = 'user.register';
        return this.post( data );
    }
    login( data: USER_LOGIN ): Observable<USER_LOGIN_RESPONSE> {
        data['xapi'] = 'user.login';
        return this.post( data );
    }

    checkResult( res ) {
        if ( ! res ) throw this.error( 'response-is-empty' );
        // if ( res.code === void 0 ) throw this.error('code-does-not-exist-in-response');
        if ( res['code'] !== void 0 ) throw this.error( res['code'], res['message'] );
        return res;
    }
}
