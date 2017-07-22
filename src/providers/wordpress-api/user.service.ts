/**
 * This has combination codes of Wordpress API, Firebase SDK, Kakao, Naver, and other 
 */
import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { ERROR, KEY_LOGIN } from '../../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { Observable } from 'rxjs/Observable';

import {
    SOCIAL_PROFILE, USER_REGISTER, USER_REGISTER_RESPONSE, USER_LOGIN, USER_LOGIN_RESPONSE,
    USER_UPDATE, USER_UPDATE_RESPONSE, USER_DATA_RESPONSE, USER_DATA
} from './interface';

@Injectable()
export class UserService extends Base {

    userProfile: USER_LOGIN_RESPONSE = null;

    constructor(
        private wp: WordpressApiService
    ) {
        super();
    }


    /**
     * @note flowchart
     *      - All social login must check if their accounts are already created.
     *          -- If so, just login.
     *          -- If no, create one ( with secret key )
     * 
     * @param profile User profile coming from the social login.
     */
    socialLoginSuccess(profile: SOCIAL_PROFILE, callback) {

        let uid = `${profile.uid}@${profile.providerId}`;
        let password = `${profile.uid}--@~'!--`;

        /// @todo improve login security.
        this.login(uid, password).subscribe(res => {

        }, error => {
            if (!profile.email) profile.email = uid + '.com'; // if email is not given.
            let data: USER_REGISTER = {
                user_login: uid,
                user_pass: password,
                user_email: profile.email,
                name: profile.name || ''
            };
            this.register(data).subscribe(res => {
                console.log("socialLoginSuccess: ", res);
            }, error => {
            });
        });
    }

    /**
     * 
     */
    get isLogin(): boolean {
        /// one time data load from localStorage
        if (this.userProfile === null) {
            let re = this.storage.get(KEY_LOGIN);
            if (re === null) this.userProfile = <USER_LOGIN_RESPONSE>{};
            else this.userProfile = re;
        }
        if (this.userProfile.user_login) return true;
        return false;

    }
    

    login(user_login: string, user_pass: string): Observable<USER_REGISTER_RESPONSE> {
        let data: USER_LOGIN = {
            user_login: user_login,
            user_pass: user_pass,
            route: 'user.login'
        };
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    register(data: USER_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        data.route = 'user.register';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    update(data: USER_UPDATE): Observable<USER_UPDATE_RESPONSE> {
        data.session_id = this.userProfile.session_id;
        data.route = 'user.profile';
        return this.wp.post(data)
            .map(res => this.setUserProfile(res));
    }

    data(): Observable<USER_DATA_RESPONSE> {
        let data: USER_DATA = {
            route: 'user.data',
            session_id: this.userProfile.session_id
        };
        return this.wp.post(data);
    }

    setUserProfile(res) {
        this.userProfile = res;
        this.storage.set(KEY_LOGIN, res);
        return res;
    }

    /**
     * User login sucessfully.
     * @note this includes all kinds of social login and wordpress api login.
     * @note This method is being invoked for alll kinds of login.
     */
    loginSuccess(successCallback, errorCallback) {

        successCallback();
    }
}