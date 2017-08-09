import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Base } from './../etc/base';
import { text } from './../etc/text';



import { config } from './../app/config';


import { WordpressApiService } from './wordpress-api/wordpress-api.service';
import { UserService } from './wordpress-api/user.service';
import { ForumService } from './wordpress-api/forum.service';
import { FileService } from './wordpress-api/file.service';


import { ConfirmModalService, CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';
export { CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';

// import { TextService } from './text.service';

import { SOCIAL_PROFILE, USER_REGISTER } from './wordpress-api/interface';
export { POST, POSTS, POST_LIST, PAGE, PAGES, FILE, FILES, POST_CREATE, POST_DELETE, POST_DELETE_RESPONSE } from './wordpress-api/interface';


import { AlertModalService } from './modals/alert/alert.modal';
import { PushMessageService } from './push-message';

import { environment } from './../environments/environment';


import { HeaderWidget } from './../widgets/header/header';

import {
    POST_LIST, PAGE
} from './wordpress-api/interface';


@Injectable()
export class AppService extends Base {
    config = config;

    text = text;

    //
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    kakao;

    headerWidget: HeaderWidget;

    pageLayout: 'wide' | 'column' | 'advertisement' = 'column';

    constructor(
        public user: UserService,
        public forum: ForumService,
        public wp: WordpressApiService,
        public file: FileService,
        // public text: TextService,
        private confirmModalService: ConfirmModalService,
        private ngZone: NgZone,
        private router: Router,
        public alert: AlertModalService,
        public push: PushMessageService
    ) {
        super();
        // console.log("AppService::constructor()");

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
        location.href = "https://www.sonub.com/wp-content/plugins/xapi-2/naver-login.php?return_url=" + environment.clientUrl
    }

    /**
     * 
     * @note Since the login of naver login different, it is not in 'login.ts'
     *  
     * @note This will be called only one time after naver login.
     */
    checkLoginWithNaver() {
        let params = this.queryString();

        // console.log('qs:', params);

        if (params['naver_login_response'] === void 0) return;

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
        this.alert.error(e);
        setTimeout(() => this.rerenderPage(), 500);
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


    }


    /**
     * 
     * User logged in sucessfully.
     * 
     * @attention All login comes here.
     * 
     * 
     * 
     * @note this includes all kinds of social login and wordpress api login.
     * @note This method is being invoked for alll kinds of login.
     */
    loginSuccess(callback?) {
        console.log("AppService::loginSuccess()");
        setTimeout(() => this.rerenderPage(), 10);
        this.push.updateWebToken();
        this.push.updateCordovaToken();
        if (callback) callback();

        // this.updateUserLogin();

    }



    /**
     * Set's header title.
     * @param str 
     */
    title(str) {
        this.headerWidget.title = this.text(str);
    }


    /**
     * 
     * @param key 
     * @param value 
     */
    cacheSet(key, value) {
        this.storage.set(key, value);
    }
    /**
     * 
     * @param key Key
     * @return null if there is no data.
     */
    cacheGet(key) {
        return this.storage.get(key);
    }

    cacheKeyPage(req: POST_LIST) {
        return req.category_name + '-' + req.paged;
    }
    /**
     * Gets a page of post list and set it in cache.
     * @note it caches upto 3 pages only.
     * @note it can be used for latest posts of a forum.
     * @param req Request of post list.
     * @param page 
     */
    cacheSetPage(req: POST_LIST, page: PAGE) {
        if (req.paged <= 3) this.cacheSet(this.cacheKeyPage(req), page);
    }
    cacheGetPage(req: POST_LIST) {
        return this.cacheGet(this.cacheKeyPage(req));
    }


    get userProfilePhotoUrl() {
        if (this.user.isLogin && this.user.profile.photoURL) return this.user.profile.photoURL;
        else return '/assets/img/anonymous.png';
    }

}
