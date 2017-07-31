import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Base } from './../etc/base';

import { config } from './../app/config';



import { WordpressApiService } from './wordpress-api/wordpress-api.service';
import { UserService } from './wordpress-api/user.service';
import { ForumService } from './wordpress-api/forum.service';
import { FileService } from './wordpress-api/file.service';


import { ConfirmModalService, CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';
export { CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';


import { TextService } from './text.service';

import { SOCIAL_PROFILE, USER_REGISTER } from './wordpress-api/interface';




@Injectable()
export class AppService extends Base {
    config = config;
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    kakao;
    constructor(
        public user: UserService,
        public forum: ForumService,
        public wp: WordpressApiService,
        public file: FileService,
        public text: TextService,
        private confirmModalService: ConfirmModalService,
        private ngZone: NgZone,
        private router: Router
    ) {
        super();
        console.log("AppService::constructor()");

        this.initKakao();
        this.checkLoginWithNaver();

        this.auth = firebase.auth();
        this.db = firebase.database().ref('/');
    }



    initKakao() {
        this.kakao = window['Kakao'];
        this.kakao.init('937af10cf8688bd9a7554cf088b2ac3e');
    }



    loginWithNaver() {
        location.href = "https://www.sonub.com/wp-content/plugins/xapi-2/naver-login.php?return_url=https://sonub.com";
    }

    /**
     * 
     * @note Since the login of naver login different, it is not in 'login.ts'
     *  
     * @note This will be called only one time after naver login.
     */
    checkLoginWithNaver() {
        let params = this.queryString();

        console.log('qs:', params);

        if ( params['naver_login_response'] === void 0 ) return;

        let res = {};
        try {
            let dec = decodeURIComponent(params['naver_login_response']);
            res = JSON.parse(dec);
        }
        catch (e) {
            this.warning('failed-to-parse-naver-login-response');
        }

        if (res['code']) return this.warning(res['message']);




        // User has just logged in with naver id. ( 방금 로그인 )
        if (res['data']) {
            console.log("User just logged in with Naver!");
            history.pushState('', document.title, window.location.pathname);

            let naver = res['data']['response'];
            if (!naver || naver.id === void 0) return this.warning('failed-to-get-naver-id');

            let profile: SOCIAL_PROFILE = {
                providerId: 'naver',
                name: naver['nickname'],
                uid: naver['id'] + '@naver',
                email: naver['email'],
                photoURL: naver['profile_image']
            };


            this.socialLoginSuccess(profile, () => {
                console.log("naver social login success");
                this.loginSuccess();
            });

        }
    }




    /**
     * Display erorr.
     * @deprecated use .warning();
     * @note all kinds of error will be displayed here.
     * @attention Input object must have a property of 'code' for error code and 'message' for explanation of the error.
     * @param e Error object or can be a string.
     */
    displayError(e) {
        let msg;
        if (typeof e === 'string') msg = e;
        else {
            // if ( e.code === void 0 && e.message !== void 0 ) e.code = e.message;
            // msg = `${e.code}: ${message}`;

            msg = this.getErrorString(e);
        }
        alert(msg);
    }

    warning(e) {

        let msg = '';
        if (typeof e === 'string') msg = this.text.translate(e);
        else if (e.code) msg = this.text.translate(e.code);
        else if (e.message) msg = this.text.translate(e.message);

        alert(msg);

        // return this.displayError(e);

    }


    confirm(options: CONFIRM_OPTIONS): Promise<any> {
        if (options['buttons'] === void 0) alert("No buttons on confirm!");
        else return this.confirmModalService.open(options);
    }

    input(title) {
        return prompt(title);
    }


    rerenderPage() {
        this.ngZone.run(() => { });
    }


    /**
     * Returns true if the app is running on Mobile as Cordova mobile app.
     */
    get isCordova(): boolean {
        if (window['cordova']) return true;
        if (document.URL.indexOf('http://') === -1
            && document.URL.indexOf('https://') === -1) return true;
        return false;
    }




    /**
     * All social login comes here. You have to register or login to wordpress.
     * 
     * @note flowchart
     *      - All social login must check if their accounts are already created.
     *          -- If so, just login.
     *          -- If no, create one ( with secret key )
     * 
     * @param profile User profile coming from the social login.
     */
    socialLoginSuccess(profile: SOCIAL_PROFILE, callback) {


        console.log('Going to socialLgoin: ', profile);
        this.user.loginSocial(profile.uid).subscribe(res => {
            console.log("Social login success");
            callback();
            profile['session_id'] = res.session_id;
            this.user.updateSocial(profile).subscribe(res => {
                console.log('updateSocial: ', res);
            }, e => this.warning(e));
        }, e => {
            console.log("social login failed: ", e);
            console.log('going to register soical: ', profile);
            this.user.registerSocial(profile).subscribe(res => {
                callback();
            }, e => this.warning(e));
        });





        // let password = `${profile.uid}--@~'!--`; /// <<<=== Week password. uid is used as user_login. You must not show uid to user or any browser.




        // console.log("going to login with: ", uid, password);
        // this.user.login(uid, password).subscribe(res => {
        //     callback();
        // }, error => {
        //     console.log("social Login Failed. going to register");
        //     if (!profile.email) profile.email = uid + '.com'; // if email is not given, make one.
        //     let data: USER_REGISTER = {
        //         user_login: uid,
        //         user_pass: password,
        //         user_email: profile.email,
        //         name: profile.name
        //     };
        //     console.log('data:');
        //     console.log(data);
        //     this.user.register(data).subscribe(res => {
        //         console.log("socialLoginSuccess: ", res);
        //         callback();
        //     }, e => {
        //         if ( e.code == 'email_exist' ) e.code = 'social_register_email_exist';
        //         this.warning( e );
        //     });
        // });
    }


    /**
     * All login comes here.
     * User login sucessfully.
     * @note this includes all kinds of social login and wordpress api login.
     * @note This method is being invoked for alll kinds of login.
     */
    loginSuccess(callback?) {
        setTimeout(() => this.rerenderPage(), 100);
        if (callback) callback();
    }

}
