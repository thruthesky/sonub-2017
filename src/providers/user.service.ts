import { Injectable } from '@angular/core';
import { Base, ERROR } from './base';
import { WordpressApiService } from './wordpress-api.service';
import { Observable } from 'rxjs/Observable';




export interface SOCIAL_PROFILE {
    uid: string;                // User ID of the social.
    email?: string;
    providerId?: string;
    name?: string;              // displayName
    photoURL?: string;
};

export interface USER_REGISTER {
    user_login: string;
    user_pass: string;
    display_name: string;
    user_email: string;
};


export interface USER_REGISTER_RESPONSE {
    user_login: string;
    user_email: string;
    user_nicename: string;
    session_id: string;
};
export interface USER_LOGIN {
    user_login: string;
    user_pass: string;
}
export interface USER_LOGIN_RESPONSE extends USER_REGISTER_RESPONSE { };



@Injectable()
export class UserService extends Base {

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
        this.login(uid, password, success => {

        }, error => {
            if (!profile.email) profile.email = uid + '.com'; // if email is not given.
            let data: USER_REGISTER = {
                user_login: uid,
                user_pass: password,
                user_email: profile.email,
                display_name: profile.name || ''
            };
            this.register(data).subscribe(res => {
                console.log("socialLoginSuccess: ", res);
            }, error => {
            });
        });
    }

    login(uid, password, successCallback, errorCallback) {

        errorCallback(this.error(ERROR.login_failed, 'for testing.'));

        // this.loginSuccess( successCallback, errorCallback );
    }


    register(data: USER_REGISTER): Observable<USER_REGISTER_RESPONSE> {
        return this.wp.register(data);
        // this.wp.register(data).subscribe(res => {
        //     console.log(res);
        // }, error => {
        //     console.log("erorr: ", error);
        // });
        // console.log("User is going to register with: ", data);
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