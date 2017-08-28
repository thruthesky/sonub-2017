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
import { ShareService } from './share.service';
import { ErrorService } from './error.service';



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


    ///

    // dependencies
    // auth: firebase.auth.Auth; // moved to base
    // db: firebase.database.Reference; // moved to base


    kakao;


    /**
     * This event triggered when a user logs in/out from firebase.
     */
    firebaseAuthChange = new BehaviorSubject<boolean>(false);
    /**
     * This is true when a user logged in firebase.
     */
    firebaseLogin: boolean = false;



    /// layout
    headerWidget: HeaderWidget;
    pageLayout: 'wide' | 'column' | 'two-column' = 'column';



    anonymousPhotoURL = '/assets/img/anonymous.png';



    /// language
    getLanguage = getLanguage;
    setLanguage = setLanguage;





    /// user online, offline
    trackMouseMove: Subscription;
    timerMouseMove: Subscription;


    /// page visibility
    pageVisibility = new BehaviorSubject<boolean>(true);





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
        
        private router: Router,
        public alert: AlertModalService,
        public push: PushMessageService,
        public chat: ChatService,
        public share: ShareService,
        public error: ErrorService
    ) {
        super();
        // console.log("AppService::constructor()");

        this.initKakao();
        this.checkLoginWithNaver();

        // this.auth = firebase.auth();
        // this.db = firebase.database().ref('/');

        chat.inject(this.auth, this.db, user, wp);

        this.auth.onAuthStateChanged((user) => this.firebaseOnAuthStateChanged(user));


        this.observePageVisibility();
        this.onPageVisibilityChange();

    }



    /**
     * Observe if app page has been tabbed or set to background.
     * 
     * @note    When a user changes browser tab, this.pageVisibility.next(false) happens.
     * 
     */
    observePageVisibility() {
        // Set the name of the hidden property and the change event for visibility
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document['msHidden'] !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document['webkitHidden'] !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }
        // Handle page visibility change   
        document.addEventListener(visibilityChange, () => {
            if (document[hidden]) {
                this.pageVisibility.next(false);
            }
            else {
                this.pageVisibility.next(true);
            }
        }, false);
    }

    onPageVisibilityChange() {
        this.pageVisibility.subscribe( visible => {
            if ( visible ) {
                this.userOnline();
            }
            else {
                this.userAway();
            }
        })
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


    warning(e, message?) {
        this.error.alert( e, message );
    }


    confirm(options: CONFIRM_OPTIONS): Promise<any> {
        if (options['buttons'] === void 0) alert("No buttons on confirm!");
        else return this.confirmModalService.open(options);
    }

    input(title) {
        return prompt(title);
    }


    rerenderPage(timeout = 0) {
        this.share.rerenderPage( timeout );
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

        this.share.bootstrapLoginLogout();

        this.firebaseLogin_ifNot();
    }

    /**
     * All user logout must call this method.
     * @warning this must be the only method to be used to logout.
     */
    logout() {
        this.share.logout();

        // this.user.logout();
        // this.userOffline(() => {
        //     this.auth.signOut();
        // });
        // this.bootstrapLoginLogout();

        
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

    userUpdate(data, callback?) {
        this.share.userUpdate( data, callback);
        // if (this.userLocation) this.userLocation.update(data).then(() => {
        //     if (callback) callback();
        // });
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

    userOffline(callback) {
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

    /**
     * Returns user photo URL or default photo url.
     * @param url user photo URL
     */
    photoUrl( url ) {
        if ( url ) return url;
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
        this.share.listenFirebaseComunityLog();
    }


    safeHtml(raw): string {
        return this.domSanitizer.bypassSecurityTrustHtml(raw) as string;
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
                this.share.userLocation.onDisconnect().update({ status: 'offline' });
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
