import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';


import { Base } from './../etc/base';
import { text } from './../etc/text';
import { ERROR } from './../etc/error';
export { ERROR } from './../etc/error';
import { getLanguage, setLanguage } from './../etc/language';




import { config } from './../app/config';


import { WordpressApiService } from './wordpress-api/wordpress-api.service';
import { UserService } from './wordpress-api/user.service';
import { ForumService } from './wordpress-api/forum.service';
import { FileService } from './wordpress-api/file.service';
import { JobService } from './wordpress-api/job.service';


import { ConfirmModalService, CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';
export { CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';

// import { TextService } from './text.service';

import { SOCIAL_PROFILE, USER_REGISTER, ACTIVITIES, ACTIVITY, COMMUNITY_LOG, COMMUNITY_LOGS } from './wordpress-api/interface';
export {
    POST, POSTS, POST_LIST, PAGE, PAGES, FILE, FILES, POST_CREATE, POST_DELETE, POST_DELETE_RESPONSE,
    JOB, JOBS, POST_QUERY_REQUEST, JOB_PAGE, JOB_PAGES, POST_QUERY_RESPONSE,
    ACTIVITY, ACTIVITIES, COMMUNITY_LOGS
} from './wordpress-api/interface';


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


    // section of the page
    sectionName = 'home';


    //
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    kakao;

    headerWidget: HeaderWidget;

    pageLayout: 'wide' | 'column' | 'two-column' = 'column';

    anonymousPhotoURL = '/assets/img/anonymous.png';


    firebaseDatabaseListenActivityEventHandler = null;
    activity: ACTIVITIES = [];
    communityLogs: COMMUNITY_LOGS = [];


    getLanguage = getLanguage;
    setLanguage = setLanguage;


    toastOption = {
        show: false,
        content: '',
        callback: () => { }
    };


    width = 0; /// page width

    constructor(
        private domSanitizer: DomSanitizer,
        public user: UserService,
        public forum: ForumService,
        public job: JobService,
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

        Observable.fromEvent(window, 'resize')
            .debounceTime(100)
            .subscribe((event) => {
                this.width = window.innerWidth;
            });

        this.width = window.innerWidth;
    }


    get size(): 'mobile' | 'break-a' | 'break-c' | 'break-d' {
        if (this.width < 600) return 'mobile';
        else if (this.width < 840) return 'break-a';
        else if (this.width < 1140) return 'break-c';
        return 'break-d';
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
        this.warning(e);
        // let msg;
        // if (typeof e === 'string') msg = e;
        // else {
        //     // if ( e.code === void 0 && e.message !== void 0 ) e.code = e.message;
        //     // msg = `${e.code}: ${message}`;

        //     msg = this.getErrorString(e);
        // }
        // alert(msg);
    }

    /**
     * 
     * @param e - is an Error Response Object or ERROR code from error.ts
     */
    warning(e) {
        if ( typeof e == 'number' && e < 0 ) {
            e = { code: e };
        }
        this.alert.error(e);
        setTimeout(() => this.rerenderPage(), 400);
    }


    confirm(options: CONFIRM_OPTIONS): Promise<any> {
        if (options['buttons'] === void 0) alert("No buttons on confirm!");
        else return this.confirmModalService.open(options);
    }

    input(title) {
        return prompt(title);
    }


    rerenderPage(timeout = 0) {
        if (timeout) {
            setTimeout(() => this.ngZone.run(() => { }), timeout);
        }
        else this.ngZone.run(() => { });
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
     * @see https://docs.google.com/document/d/1m3-wYZOaZQGbAzXeVlIpJNSdTIt3HCUiIt9UTmZUgXo/edit#heading=h.30erqp1hvdiu
     */
    socialLoginSuccess(profile: SOCIAL_PROFILE, callback) {

        console.log('Going to socialLgoin: ', profile);
        this.user.loginSocial(profile.uid).subscribe(res => {
            console.log("Social login success. res: ", res);
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

        this.bootstrapLoginLogout();

    }

    /**
     * All user logout must call this method.
     * @warning this must be the only method to be used to logout.
     */
    logout() {
        this.user.logout();
        this.bootstrapLoginLogout();
    }



    /**
     * Set's section.
     * @param name 
     */
    section(name) {
        this.sectionName = name;
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
    cacheSetPage(req: any, page: any) {
        if (req.paged <= 3) this.cacheSet(this.cacheKeyPage(req), page);
    }
    cacheGetPage(req: any) {
        return this.cacheGet(this.cacheKeyPage(req));
    }


    
    get userPhotoUrl(): string {
        if (this.user.isLogin && this.user.profile.photoURL) return this.user.profile.photoURL;
        else return '/assets/img/anonymous.png';
    }




    postUserPhotoUrl(data) {
        if (data && data.author && data.author.photoURL) return data.author.photoURL;
        else return this.anonymousPhotoURL;
    }

    postUserName(data) {
        if (data && data.author && data.author.name) return data.author.name;
        else return 'Anonymous';
    }


    /**
     * Returns true if 'data' is mine.
     * @param data Post or Comment
     */
    my(data) {
        if (!this.user.id) return false;
        if (data && data['ID'] && data['post_author'] == this.user.id) return true;
        if (data && data['comment_ID'] && data['user_id'] == this.user.id) return true;
        return false;
    }

    /**
     * Returns true if 'data' is written by anonymous.
     * @param data Post of Comment
     */
    anonymous(data) {
        if ((data && data['ID']) && (data['post_author'] == 0)) return true;
        if ((data && data['comment_ID']) && (data['user_id'] == 0)) return true;
        return false;
    }


    /**
     * This is called only one time when the app boots.
     * This is directly called by app.component.ts
     */
    bootstrap() {
        this.listenFirebaseComunityLog();
    }


    /**
     * 
     * This may be called multiple times. When user
     *      - app boots
     *      - login
     *      - logout
     */
    bootstrapLoginLogout() {
        this.listenFirebaseUserActivity();
    }

    listenFirebaseUserActivity() {
        let ref = this.db.child('user-activity').child(this.user.id.toString());
        if (this.user.isLogout) {
            if (this.firebaseDatabaseListenActivityEventHandler) {
                ref.off('value', this.firebaseDatabaseListenActivityEventHandler);
                this.firebaseDatabaseListenActivityEventHandler = null;
            }
            return;
        }
        if (this.firebaseDatabaseListenActivityEventHandler) {
            // ref.off('value', this.firebaseDatabaseListenActivityEventHandler);
            // this.firebaseDatabaseListenActivityEventHandler = null;
        }
        this.firebaseDatabaseListenActivityEventHandler = ref
            .limitToLast(5)
            .on('child_added', snap => {
                let val: ACTIVITY = snap.val();
                if (!val) return;
                if (typeof val !== 'object') return;

                // console.log('snap.val', val);
                // let keys = Object.keys(val);
                // if (keys && keys.length) {
                //     this.activity = [];
                //     for (let key of keys.reverse()) {
                //         this.activity.push(val[key]);
                //     }
                // }
                this.activity.unshift(val);
                this.toastLog(val, 'activity');
                this.rerenderPage();
                // val.reverse();
            }, e => console.error(e));
    }

    listenFirebaseComunityLog() {
        let path = this.db.child('forum-log').child('posts-comments');
        let ref = path.limitToLast(10).once('value', snap => {
            let val: COMMUNITY_LOGS = snap.val();
            if (!val) return;
            if (typeof val !== 'object') return;

            // console.log('posts-comments: snap.val: ', val);
            let keys = Object.keys(val);
            if (keys && keys.length) {
                for (let key of keys.reverse()) {
                    this.communityLogs.push(val[key]);
                }
            }
            this.communityLogs.shift(); // last one(latest log) will be added by 'child_added'
            this.rerenderPage();


            /// listen the lastest one.
            path.orderByKey().limitToLast(1).on('child_added', snap => {
                let val: COMMUNITY_LOG = snap.val();
                if (!val) return;
                if (typeof val !== 'object') return;
                // console.log('posts-comments: child_added: snap.val: ', val);

                this.toastLog(val, 'community');

                this.communityLogs.unshift(val);
                this.rerenderPage(100);
            });

        }, e => console.error(e));

    }

    safeHtml(raw): string {
        return this.domSanitizer.bypassSecurityTrustHtml(raw) as string;
    }



    toast(option) {
        if (option.delay === void 0) option.delay = 1;
        setTimeout(() => {
            this.toastOption = option;
            this.toastOption.show = true;
            if (option.timeout !== void 0) {
                setTimeout(() => this.toastClose(), option.timeout);
            }
        }, option.delay);
    }

    toastClose() {
        this.toastOption.show = false;
        this.rerenderPage();
    }


    postView(post_ID) {
        this.router.navigateByUrl(this.forum.postUrl(post_ID));
    }

    toastLog(val, type) {

        // console.log("toastLog: width: ", this.width);
        // console.log("toastLog: size: ", this.size);

        if (this.size == 'break-d') return;

        let toastOption = {
            content: val.content,
            timeout: 7000,
            callback: () => {
                this.toastClose();
                this.postView(val.post_ID);
            }
        };

        if (type == 'activity' && this.size == 'mobile' ) {
            toastOption.content = '<span class="cap activity-cap">A</span> ' + toastOption.content;
            this.toast(toastOption);
        }

        if (type == 'community') {
            if ( val.author_id == this.user.id ) return;
            if (val.comment_ID === void 0 || !val.comment_ID) {
                toastOption.content = '<span class="cap community-cap">C</span> ' + toastOption.content;
                this.toast(toastOption);
            }
        }
    }


    go( url ) {
        this.router.navigateByUrl( url );
    }
}
