/**
 * This has combination codes of Wordpress API, Firebase SDK, Kakao, Naver, and other
 */
import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { KEY_LOGIN } from '../../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { Observable } from 'rxjs/Observable';
import { error, ERROR } from './../../etc/error';

import {
    USER_REGISTER, USER_REGISTER_RESPONSE, USER_LOGIN, USER_LOGIN_RESPONSE,
    USER_UPDATE, USER_UPDATE_RESPONSE, USER_DATA_RESPONSE, USER_DATA,
    SOCIAL_REGISTER, SOCIAL_UPDATE,
    ACTIVITY_REQUEST, ACTIVITY_RESPONSE, USER_CHANGE_PASSWORD, REQUEST
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
        if ( this.sessionId ) return true;
        else return false;
    }

    get isLogout(): boolean {
        return ! this.isLogin;
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
        console.log('user service::logout');
        this.rawSetUserProfile(null);
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
        console.log("loginSoical: uid: ", uid);
        return this.wp.post( data )
            .map(res => this.setUserProfile( res ) );
    }

    /**
     * This registers social logged in user to backend.
     * @param data user data
     */
    registerSocial(data: SOCIAL_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.registerSocial';
        // data['timezone_offset'] = this.getTimezoneOffset();
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }


    /**
     *
     * This updates social user information(name, photo) into backend.
     *
     * @param data
     */
    updateSocial(data: SOCIAL_UPDATE): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.updateSocial';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }




    update(data: USER_UPDATE): Observable<USER_UPDATE_RESPONSE> {
        data.session_id = this.sessionId;
        data.route = 'user.profile';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }


    changePassword(data: USER_CHANGE_PASSWORD): Observable<any> {
        data.session_id = this.sessionId;
        data.route = 'user.password';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    resign(): Observable<any> {
        let data: REQUEST = {
            session_id : this.sessionId,
            route : 'user.resign'
        };
        return this.wp.post(data)
            .map(res => {
                if( res == this.email) this.logout();
                return res;
            });

    }

    data(): Observable<USER_DATA_RESPONSE> {
        let data: USER_DATA = {
            route: 'user.data',
            session_id: this.sessionId
        };
        return this.wp.post(data);
    }

    openProfile(id) {
        let data = {
            route: 'user.open_profile',
            id: id,
            session_id: this.sessionId
        };
        return this.wp.post(data);
    }


    update_user_meta(key, value): Observable<string> {
        let data = {
            route: 'wordpress.update_user_meta',
            session_id: this.sessionId,
            key: key,
            value: value
        };
        return this.wp.post(data);
    }

    update_user_metas( keys_values ): Observable<any> {
        let data = {
            route: 'wordpress.update_user_metas',
            session_id: this.sessionId,
            keys_values: keys_values
        };
        // console.log('data', data);
        return this.wp.post( data );
    }

    setUserProfile(res: USER_LOGIN_RESPONSE) {
        if ( res && res.session_id && typeof res.session_id === 'string' && res.session_id ) {
            this.rawSetUserProfile(res);
            return res;
        }
        else throw error( ERROR.USER_LOGIN_RESPONSE_HAS_NO_SESSION_ID, "Error on setUserProfile(). No session id exists. It may be a wrong session id or User login failed." );
    }

    /**
     * This must only be called by setUserProfile() and logout()
     * @param data
     */
    rawSetUserProfile( data ) {
        this.profile = data;
        this.storage.set(KEY_LOGIN, data);
    }



    get sessionId(): string {
        if (this.profile && this.profile.session_id && typeof this.profile.session_id === 'string' ) return this.profile.session_id;
        else return '';
    }
    get id(): number {
        if (this.profile && this.profile.ID) return this.profile.ID;
        else return 0;
    }
    get uid(): number {
        return this.id;
    }

    get name(): string {
        if (this.profile && this.profile.display_name) return this.profile.display_name;
        else return '';
    }

    get email(): string {
        if (this.profile && this.profile.user_email) return this.profile.user_email;
        else return '';
    }

    get provider(): string {
        if (this.profile && this.profile.provider) return this.profile.provider;
        else return '';
    }
    get photoURL(): string {
        if (this.profile && this.profile.photoURL) return this.profile.photoURL;
        else return '';
    }


    get nameOrAnonymous() {
        return this.name || 'Anonymous';
    }


    /**
     * Request for processing user action activiy to backend server.
     * @note use this method after user action like 'like', 'dislike', 'comment', 'post', etc
     * @note the server may do 'push message', 'log into firebase database', etc.
     *
     *
     */
    activity(req: ACTIVITY_REQUEST): Observable<ACTIVITY_RESPONSE> {
        req.route = 'wordpress.activity';
        req.session_id = this.sessionId;
        return this.wp.post(req);
    }

}
