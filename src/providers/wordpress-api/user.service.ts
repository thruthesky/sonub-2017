/**
 * This has combination codes of Wordpress API, Firebase SDK, Kakao, Naver, and other 
 */
import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { KEY_LOGIN } from '../../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { Observable } from 'rxjs/Observable';

import {
    USER_REGISTER, USER_REGISTER_RESPONSE, USER_LOGIN, USER_LOGIN_RESPONSE,
    USER_UPDATE, USER_UPDATE_RESPONSE, USER_DATA_RESPONSE, USER_DATA,
    SOCIAL_REGISTER, SOCIAL_UPDATE
} from './interface';

@Injectable()
export class UserService extends Base {

    profile: USER_LOGIN_RESPONSE = null;

    constructor(
        private wp: WordpressApiService
    ) {
        super();
        this.loadProfile();
    }


    get isLogin(): boolean {
        /// one time data load from localStorage
        if (this.profile === null) this.loadProfile();
        if ( this.profile.session_id !== void 0 && this.profile.session_id != '' ) return true;
        else return false;
    }

    /**
     * 
     * @Warning This will load user profile from localStorage.
     * @Warning So, this must be case on every bootstrap.
     * @Attention This is being called in UserService::constructor which will be called by AppService::constructor.
     *          Meaning, if you inject AppService on every module, user profile will be loaded automatically.
     */
    loadProfile() {
        let re = this.storage.get(KEY_LOGIN);
        if (re === null) this.profile = <USER_LOGIN_RESPONSE>{};
        else this.profile = re;
        return this.profile;
    }


    login(user_email: string, user_pass: string): Observable<USER_REGISTER_RESPONSE> {
        let data: USER_LOGIN = {
            user_email: user_email,
            user_pass: user_pass,
            route: 'user.login',
            // timezone_offset: this.getTimezoneOffset()
        };
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    logout() {
        this.setUserProfile(null);
    }

    register(data: USER_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.register';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }


    loginSocial( uid ): Observable<USER_REGISTER_RESPONSE> {
        let data = {
            route: 'user.loginSocial',
            uid: uid,
            // timezone_offset: this.getTimezoneOffset()
        };
        return this.wp.post( data )
            .map(res => this.setUserProfile( res ) );
    }
    
    registerSocial(data: SOCIAL_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.registerSocial';
        // data['timezone_offset'] = this.getTimezoneOffset();
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    
    updateSocial(data: SOCIAL_UPDATE): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.updateSocial';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    
        

    update(data: USER_UPDATE): Observable<USER_UPDATE_RESPONSE> {
        data.session_id = this.profile.session_id;
        data.route = 'user.profile';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    data(): Observable<USER_DATA_RESPONSE> {
        let data: USER_DATA = {
            route: 'user.data',
            session_id: this.profile.session_id
        };
        return this.wp.post(data);
    }


    update_user_meta(key, value): Observable<string> {
        let data = {
            route: 'wordpress.update_user_meta',
            session_id: this.profile.session_id,
            key: key,
            value: value
        };
        return this.wp.post(data);
    }

    update_user_metas( keys_values ): Observable<any> {
        let data = {
            route: 'wordpress.update_user_metas',
            session_id: this.profile.session_id,
            keys_values: keys_values
        };
        console.log('data', data);
        return this.wp.post( data );
    }

    setUserProfile(res) {
        this.profile = res;
        this.storage.set(KEY_LOGIN, res);
        return res;
    }



    get sessionId(): string {
        if (this.profile && this.profile.session_id) return this.profile.session_id;
        else return '';
    }

    get name(): string {
        if (this.profile && this.profile.display_name) return this.profile.display_name;
        else return '';
    }

    get nameOrAnonymous() {
        return this.name || 'Anonymous';
    }
}