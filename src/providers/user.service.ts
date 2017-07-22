import { Injectable } from '@angular/core';
import { Base } from '../etc/base';
import { ERROR, KEY_LOGIN } from '../etc/define';
import { REQUEST } from './../etc/interface';
import { WordpressApiService } from './wordpress-api.service';
import { Observable } from 'rxjs/Observable';



export interface SOCIAL_PROFILE {
    uid: string;                // User ID of the social.
    email?: string;
    providerId?: string;
    name?: string;              // displayName
    photoURL?: string;
};


export interface USER_LOGIN {
    route?: string;
    user_login: string;
    user_pass: string;
}

export interface USER_COMMON {
    user_email: string;
    name?: string;
    mobile?: string;
    gender?: string;
    address?: string;
    birthday?: string;
    landline?: string;
}
export interface USER_REGISTER extends USER_LOGIN, USER_COMMON { };


export interface USER_REGISTER_RESPONSE {
    user_login: string;
    user_email: string;
    user_nicename: string;
    session_id: string;
};
export interface USER_LOGIN_RESPONSE extends USER_REGISTER_RESPONSE { };
export interface USER_UPDATE_RESPONSE extends USER_REGISTER_RESPONSE { };

export interface USER_UPDATE extends REQUEST, USER_COMMON { };

export interface USER_DATA extends REQUEST { };
export interface USER_DATA_RESPONSE extends USER_COMMON { };


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
        return this.wp.login(user_login, user_pass)
            .map(res => this.setUserProfile(res));
    }

    register(data: USER_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        return this.wp.register(data)
            .map(res => this.setUserProfile(res));
    }

    update(data: USER_UPDATE): Observable<USER_UPDATE_RESPONSE> {
        data.session_id = this.userProfile.session_id;
        return this.wp.userUpdate(data)
            .map(res => this.setUserProfile(res));
    }

    data(): Observable<USER_DATA_RESPONSE> {
        return this.wp.userData({ session_id: this.userProfile.session_id });
            // .map(res => this.setUserProfile(res));
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