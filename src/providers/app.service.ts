import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';






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
import { BuyAndSellService } from './wordpress-api/buyandsell.service';

import { ChatService } from './chat.service';



import { ConfirmModalService, CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';
export { CONFIRM_OPTIONS } from './modals/confirm/confirm.modal';

// import { TextService } from './text.service';

import { SOCIAL_PROFILE, USER_REGISTER, ACTIVITIES, ACTIVITY, COMMUNITY_LOG, COMMUNITY_LOGS, SITE_PREVIEW, POST } from './wordpress-api/interface';
export {
    POST, POSTS, POST_LIST, PAGE, PAGES, FILE, FILES, POST_CREATE, POST_DELETE, POST_DELETE_RESPONSE,
    JOB, JOBS, POST_QUERY_REQUEST, JOB_PAGE, JOB_PAGES, POST_QUERY_RESPONSE,
    ACTIVITY, ACTIVITIES, COMMUNITY_LOGS, COMMUNITY_LOG, SITE_PREVIEW
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
    e = ERROR; /// error codes


    // section of the page
    sectionName = 'home';


    //
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    kakao;


    /**
     * This event triggered when a user logs in/out from firebase.
     */
    firebaseAuthChange = new BehaviorSubject<boolean>(false);
    /**
     * This is true when a user logged in firebase.
     */
    firebaseLogin: boolean = false;


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
        className: '',
        callback: () => { }
    };


    width = 0; /// page width






    /// user online, offline
    trackMouseMove: Subscription;
    timerMouseMove: Subscription;


    constructor(
        private domSanitizer: DomSanitizer,
        public user: UserService,
        public forum: ForumService,
        public job: JobService,
        public bns: BuyAndSellService,
        public wp: WordpressApiService,
        public file: FileService,
        // public text: TextService,
        private confirmModalService: ConfirmModalService,
        private ngZone: NgZone,
        private router: Router,
        public alert: AlertModalService,
        public push: PushMessageService,
        public chat: ChatService
    ) {
        super();
        // console.log("AppService::constructor()");

        this.initKakao();
        this.checkLoginWithNaver();

        this.auth = firebase.auth();
        this.db = firebase.database().ref('/');

        chat.inject( this.auth, this.db, user );

        Observable.fromEvent(window, 'resize')
            .debounceTime(100)
            .subscribe((event) => {
                this.width = window.innerWidth;
            });

        this.width = window.innerWidth;

        this.auth.onAuthStateChanged((user) => this.firebaseOnAuthStateChanged(user));



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
     * @note Since naver login refreshes(redirected) by naver login api, it is not in 'login.ts'
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
     * @param e - is an Error Response Object or ERROR code ( interger less than 0 ) from error.ts
     * @param message - is only used when e is ERROR code.
     * 
     * @example e => app.warning(e); // 'e' is server response.
     * @example app.warning(-8088, 'Wrong user. User Xapi ID does not exist on firebase.');
     */
    warning(e, message?) {
        ///
        /// setTimeout() here is for preventing error of 'ExpressionChangedAfterItHasBeenCheckedError'
        ///     - when the focus is on input-box, and ngb-modal opens, it produces 'expression changed' error.
        ///
        // setTimeout(() => {
        if (typeof e == 'number' && e < 0) {
            e = { code: e };
            if (message) e['message'] = message;
        }
        // this.alert.error(e)
        setTimeout(() => this.alert.error(e), 1); /// for 'ExpressionChangedAfterItHasBeenCheckedError' error
        setTimeout(() => this.rerenderPage(), 200);
        // }, 100 );

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
     * When social login success, it is invoked to register/login to backend.
     * 
     * @note    All social login comes here(including kakao, naver, facebook, google). NOT direct login to backend (with id/pass)
     * 
     * @note You have to register/login to backend(wordpress)
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
        this.user.loginSocial(profile.uid).subscribe(res => { // backend login
            console.log("Social login success. res: ", res);
            this.firebaseXapiLogin();
            callback();
            profile['session_id'] = res.session_id;
            this.user.updateSocial(profile).subscribe(res => { // backend login ==> update
                console.log('updateSocial: ', res);
            }, e => this.warning(e));
        }, e => {
            console.log("social login failed: ", e);
            console.log('going to register soical: ', profile);
            this.user.registerSocial(profile).subscribe(res => { // backend register
                console.log("firebase socail login ==> xapi register ==> register success");
                this.firebaseXapiRegistered();
                this.firebaseXapiLogin();
                callback();
            }, e => this.warning(e));
        });


    }


    /**
     *
     * User logged in sucessfully.
     *
     * @attention All login comes here including all social login and user/password login AND user register.
     *      - Backend(wordpress) user login/email/password registration is considered as login.
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

        this.firebaseLogin_ifNot();
    }

    /**
     * All user logout must call this method.
     * @warning this must be the only method to be used to logout.
     */
    logout() {
        this.user.logout();
        this.userOffline(() => {
            this.auth.signOut();
        });
        this.bootstrapLoginLogout();
    }


    /**
     * All user login and login out comes here.
     * 
     * @note a user logs in and logs out, this method is called.
     * 
     *
     * This may be called multiple times. When user
     *      - app boots
     *      - login
     *      - logout
     */
    bootstrapLoginLogout() {
        this.listenFirebaseUserActivity();
    }


    /**
     * 
     * Logs into firebase if the user logged in different way.
     * 
     * @note this method is invoked when
     *      - app starts ( refreshes )
     *      - logins
     *      - registers
     * @note logs out when user logout.
     *      
     * 
     * @logic
     *      1. login
     *          2. if login fails => register.
     *              3. if register fails, well, alert it.
     *          4. login again.
     */
    firebaseLogin_ifNot() {
        if (this.user.isLogout) return;
        if (this.user.provider == 'firebase') {
            console.log("Logged in with firebase already!");
            return;
        }
        let email = 'sonub' + this.user.id + '@' + this.user.provider + '.com';
        let password = this.user.sessionId;
        this.auth.signInWithEmailAndPassword(email, password)
            .then(a => this.firebaseXapiLogin())
            .catch(error => {
                // Handle Errors here.
                var errorCode = error['code'];
                var errorMessage = error['message'];
                console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
                if (errorCode == 'auth/user-not-found') {
                    this.auth.createUserWithEmailAndPassword(email, password)
                        .then(a => {
                            console.log("firebaseLogin_ifNot => firebase login => firebase create(register) => auto login success");
                            this.firebaseXapiRegistered();
                            this.firebaseXapiLogin();
                        })
                        .catch(error => {
                            // Handle Errors here.
                            var errorCode = error['code'];
                            var errorMessage = error['message'];
                            console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
                        });
                }
            });
    }

    /**
     * 
     * 
     * This method is called only one time !!
     * 
     * @note
     *      - when a user logs in with firebase social login, the user registers/logs in to backend(xapi)
     *      - when a user logs in other social login like kakao, naver, the user registers/logs into backend(xapi) and registers/logs into the firebase auth.
     *      - when a user logs directly into the site using id/password, the user registers/logs into the firebase auth.
     * 
     * 
     * @note    This method is called **only one time** when a user successfuly registered in firebase and backend.
     * @note    In this method, the user must be logged both firebase and backend.
     * 
     * @use when you need to something on only registeration.
     * @use to update/save xapi backend user id on firebase.
     * 
     * @note this method is being invoked right after
     *  
     *      1. "google auth login => xapi login"
     *      2. "xapi login => google auth login"
     * 
     * 
     */
    firebaseXapiRegistered() {
        let firebaseUser = this.auth.currentUser;
        if (!firebaseUser) {
            console.error("This is error. the firebase user shouldn't be null after register. ");
            return;
        }
        if (!this.user.id) {
            console.error("This is error. the xapi user id shouldn't be null after register. ");
            return;
        }
        console.log("firebaseXapiRegistered: going to update uid", this.user.id, firebaseUser.uid);

        // this.db.child("xapi-uid").child( this.user.id + '' ).set( { uid: firebaseUser.uid });


    }

    /**
     * This method is being called every time
     *      After a user registers or logs into both firebase and backend.
     * 
     * @note    user_login/user_password register/login and other social login(kakao/naver) will eventually registers/logs into firebase
     *          And will invoke this method.
     * 
     * @note    This method is being called from
     *          - firebaseLogin_ifNot() ( from backend login including any other social than fierbase. Including registration/login )
     *          - LoginPage::firebaseSocialLoginSuccess()
     * 
     * @note    By the time that this method is invoked, the user has already logged in firebase.
     *          So, this.auth.currentUser is available.
     * 
     * @note    You can NOT use firebaseOnAuthStateChaned() instead of using this method.
     *          
     *      This method ensures that the user login/registered both of firebase and backend
     *      while firebaseOnAuthChanged() may be called only after firebase social login but not in backend.
     * 
     * @note    By this time, that this method is being invoked,
     *          this.auth.currentUser and this.user are available.
     * 
     */
    firebaseXapiLogin() {
        this.userUpdateProfile();
    }

    firebaseOnAuthStateChanged(user: firebase.User) {

        if (user) { // user just logged in or page refreshed.
            // console.log("firebase user login okay! OnAuthStateChanged(): user just logged in or page refreshed.");
            this.beginUserIdleTracking();
            this.onConnect();
            this.firebaseAuthChange.next(true);
            this.chat.onFirebaseLogin();
            this.firebaseLogin = true;
        }
        else { // user just logged out or page refreshed
            console.log("firebaseOnAuthStateChanged(): user just logged out or page refreshed");
            // this.userUpdate({status: 'offline'});
            this.endUserIdleTracking();
            this.firebaseAuthChange.next(false);
            this.chat.onFirebaseLogout();
            this.firebaseLogin = false;
        }

    }

    get userLocation(): firebase.database.Reference {
        if (this.auth && this.auth.currentUser && this.auth.currentUser.uid) {
            return this.db.child('users').child(this.auth.currentUser.uid);
        }
        else return null;
    }
    userUpdate(data, callback?) {
        if (this.userLocation) this.userLocation.update(data).then( () => {
            if ( callback ) callback();
        } );
    }
    userUpdateProfile() {
        let data = {
            email: this.user.email,
            name: this.user.name,
            photoUrl: this.user.photoURL,
            status: 'online',
            xapiUid: this.user.id
        };
        this.userUpdate(data);
    }
    userOnline() {
        this.userUpdate({ status: 'online' });
    }

    userOffline( callback ) {
        this.userUpdate({ status: 'offline' }, callback);
    }

    userAway() {
        this.userUpdate({ status: 'away' });
    }

    /**
     * Set's section.
     * @param name
     */
    section(name) {
        this.sectionName = name;
    }
    layoutWide() {
        this.pageLayout = 'wide';
    }
    layoutColumn() {
        this.pageLayout = 'column';
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

    postUserName(data: POST) {
        if (data && data.author && data.author.name) return data.author.name;
        else return 'Anonymous';
    }
    postUserId(data: POST): number {
        if (data && data.author && data.author.ID) return data.author.ID;
        else return 0;
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
        this.firebaseLogin_ifNot();
        this.listenFirebaseComunityLog();
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

                // console.log('listenFirebaseUserActivity() snap.val', val);
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
        let ref = path.limitToLast(15).once('value', snap => {
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
        // console.log(`app.toast()`, option);
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

        if (this.size == 'break-d') return; // don't toast on wide space.

        let toastOption = {
            content: val.content,
            timeout: 10000,
            className: '',
            callback: () => {
                this.toastClose();
                this.postView(val.post_ID);
            }
        };

        if (type == 'activity' && this.size == 'mobile') {

            toastOption.className = 'activity';
            toastOption.content = '<span class="cap activity-cap">Activity</span><span class="text ellipsis">' + toastOption.content + '</span>';
            this.toast(toastOption);
        }

        if (type == 'community') {
            if (val.author_id == this.user.id) return; /// @see sonub build guide. don't show my post on toast : https://docs.google.com/document/d/1m3-wYZOaZQGbAzXeVlIpJNSdTIt3HCUiIt9UTmZUgXo/edit#heading=h.qnbta0l9c186
            if (val.comment_ID === void 0 || !val.comment_ID) { /// @see sonub build guide. don't show comment.
                toastOption.className = 'community';
                toastOption.content = '<span class="cap community-cap">Community</span><span class="text ellipsis">' + toastOption.content + '</span>';
                this.toast(toastOption);
            }
        }

    }


    go(url) {
        this.router.navigateByUrl(url);
    }


    /**
     * 
     * 
     * This method is being invoked only when user logged in firebase from 'firebaseOnAuthStateChagned()'
     * 
     * 
     */
    onConnect() {
        this.db.child('.info/connected').on('value', connected => {
            if (connected.val()) { // connected. online.
                this.userLocation.onDisconnect().update({ status: 'offline' });
                this.userOnline();
            }
            else { // disconnected. offline.

            }
        });

    }
    beginUserIdleTracking() {
        this.trackMouseMove = Observable
            .fromEvent(document, 'mousemove')
            .throttleTime(120000) // if any mouse move in 2 minutes,
            .subscribe(e => {
                this.userOnline();          // then, set user online
                this.resetMoveMoveTimer();  // reset timer.
            });
        this.resetMoveMoveTimer(); // begin tracking immediately after loading ( 처음 로드 하자 마자 한번 호출. )
    }
    resetMoveMoveTimer() {
        if (this.timerMouseMove) this.timerMouseMove.unsubscribe();
        this.timerMouseMove = Observable.timer(180000) // if no mouse move in 3 minuts,
            .subscribe(e => {          // then, set user away. until the user closes the app. or logs out.
                this.userAway();
            });
    }
    endUserIdleTracking() {
        if (this.trackMouseMove) this.trackMouseMove.unsubscribe();
        if (this.timerMouseMove) this.timerMouseMove.unsubscribe();
    }

}
