import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

import { Observable } from 'rxjs/Observable';

import { Base } from '../etc/base';


import {
    USER_REGISTER, USER_REGISTER_RESPONSE,
    USER_LOGIN, USER_LOGIN_RESPONSE,
    USER_UPDATE, USER_UPDATE_RESPONSE,
    USER_DATA, USER_DATA_RESPONSE
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

    // getPosts() {
    //     // return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    // }

    post(data): Observable<any> {
        // console.log("Url: ", this.url , JSON.stringify( data ) );
        return this.http.post(this.url, data)
            .map(e => this.checkResult(e));
    }
    register(data: USER_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        data['route'] = 'user.register';
        return this.post(data);
    }
    login(user_login: string, user_pass: string): Observable<USER_LOGIN_RESPONSE> {
        let data: USER_LOGIN = {
            user_login: user_login,
            user_pass: user_pass,
            route: 'user.login'
        };
        return this.post(data);
    }
    userUpdate(data: USER_UPDATE): Observable<USER_UPDATE_RESPONSE> {
        data['route'] = 'user.profile';
        return this.post(data);
    }

    userData(data: USER_DATA): Observable<USER_DATA_RESPONSE> {
        data['route'] = 'user.data';
        return this.post(data);
    }


    checkResult(res) {
        if (!res) throw this.error('response-is-empty');
        // if ( res.code === void 0 ) throw this.error('code-does-not-exist-in-response');
        if (res['code'] !== void 0) throw this.error(res['code'], res['message']);
        return res;
    }



    postCreate( data ): Observable<number> {
        data['route'] = 'post.create';
        return this.post(data);
    }
    postUpdate( data ): Observable<number> {
        data['route'] = 'post.update';
        return this.post(data);
    }
}
