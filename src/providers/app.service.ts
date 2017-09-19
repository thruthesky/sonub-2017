import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';

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
import { PageService } from './wordpress-api/page.service';
import { JobService } from './wordpress-api/job.service';
import { BuyAndSellService } from './wordpress-api/buyandsell.service';
import { SearchService } from './wordpress-api/search.service';

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



    /// Anonymous photo URL must begin without slash(/) for compatibility with mobile app.
    anonymousPhotoURL = 'assets/img/anonymous.png';



    /// language
    getLanguage = getLanguage;
    setLanguage = setLanguage;





    /// user online, offline, away
    myStatus: 'online' | 'offline' | 'away' = 'offline';
    trackMouseMove: Subscription;
    trackScroll: Subscription;
    trackKeyup: Subscription;
    timerAway: Subscription;
    throttleUserAction = 60000; // if there is any scroll, mouse move, key up in 60s, then it reset the away timeout.
    throttleOut = 120000; // if there is no scroll, mouse move, key up in 2 minutes, then it sets the user 'away'.


    /// window resize event
    size = {
        b: {
            width: 0
        }
    };
    windowResize = new EventEmitter<any>();

    /// page visibility
    pageVisibility = new BehaviorSubject<boolean>(true);

    headerHeight = 55; // 109 for small.


    constructor(
        private domSanitizer: DomSanitizer,
        public user: UserService,
        public forum: ForumService,
        public job: JobService,
        public bns: BuyAndSellService,
        public wp: WordpressApiService,
        public file: FileService,
        public page: PageService,
        public search: SearchService,
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

        this.trackWindowResize();
        this.trackWindowScroll();


        window['routerLink'] = this.go.bind(this);

        setTimeout(() => this.fixSidebarC(), 2000);
    }


    /**
     * This tracks window resize and get app element size after resize.
     *
     */
    trackWindowResize() {
        this.getSize();
        Observable.fromEvent(window, 'resize')
            .debounceTime(250)
            .subscribe((e: UIEvent) => {
                this.getSize();
            });
    }
    /**
     * This tracks window resize and get app element size after resize.
     *
     */
    trackWindowScroll() {
        Observable.fromEvent(window, 'scroll')
            .debounceTime(150)
            .subscribe((e: UIEvent) => {
                // console.log("Window Scrolled...");
                this.fixSidebarC();
            });
    }


    /**
     * Fixing sidebar-c
     */
    fixSidebarC() {
        let c: Element = document.querySelector('.fix-sidebar-c');
        if ( ! c ) return;
        let h = c.scrollHeight;
        let wh = window.innerHeight;
        let rx = (wh - h) + 'px';
        let top = window.pageYOffset || document.documentElement.scrollTop;
        if (h - wh < top) {
            c['style']['top'] = rx;
            c['style']['position'] = 'fixed';
        }
        else {
            c['style']['position'] = 'static';
        }
    }


    /**
     *
     * This method is being invoked on window resize.
     *
     *
     *
     * @warning when this method is invoked,
     *          IF DOM are not available, the size will become 0.
     *
     *
     *
     * @attention to make sure to get proper size after resizing, it uses setTimeout().
     *
     *
     * @code Especially when the user refreshes on a page that needs to get/use sizes( on pinitialization of the page ),
     *          // you may get SIZE of 0.
     *          // To avoid this( or to get proper size on page load )
     *          // you need to call 'getSize()' once after the view is initialized.
     *
            ngAfterViewInit() {
                setTimeout(() => this.app.getSize(), 1);
            }

     * @endcode
     */
    getSize() {
        let b = document.querySelector(".page-body-content-layout > div.b");
        if (b) {
            setTimeout(() => {
                this.size.b.width = b.clientWidth;
                // console.log(this.size.b.width);
                this.windowResize.next(this.size);
            }, 100);
        }
        return this.size;
    }
    get getSizeBWidth() {
        if (this.size && this.size.b && this.size.b.width) return this.size.b.width;
        else return 0;
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
        this.pageVisibility.subscribe(visible => {
            if (visible) {
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
            // console.log("User just logged in with Naver!");
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
                // console.log("naver social login success");
                this.loginSuccess(() => this.goHome());
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
    }

    warning(e, message?) {
        this.error.warning(e, message);
    }


    confirm(options: CONFIRM_OPTIONS): Promise<any> {
        if (options['buttons'] === void 0) alert("No buttons on confirm!");
        else return this.confirmModalService.open(options);
    }

    input(title) {
        return prompt(title);
    }


    rerenderPage(timeout = 0, callback?) {
        this.share.rerenderPage(timeout, callback);
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

        // console.log('AppService::socialLoginSuccess() ==> Going to socialLgoin: ', profile);
        this.user.loginSocial(profile.uid).subscribe(res => { // backend login
            // console.log("Social login success. res: ", res);
            this.firebaseXapiLogin();
            callback();
            profile['session_id'] = res.session_id;
            this.user.updateSocial(profile).subscribe(res => { // backend login ==> update
                // console.log('updateSocial: ', res);
            }, e => this.warning(e));
        }, e => {
            // console.log("social login failed: ", e);
            // console.log('going to register soical: ', profile);
            this.user.registerSocial(profile).subscribe(res => { // backend register
                // console.log("firebase socail login ==> xapi register ==> register success");
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
     *
     */
    loginSuccess(callback = null, options?: any) {
        // console.log("AppService::loginSuccess()");
        this.rerenderPage(10);
        this.push.updateWebToken();
        this.push.updateCordovaToken();
        if (callback) callback();
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


        /// go to home page.
        this.go('/');
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
            // console.log("Logged in with firebase already!");
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
                // console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
                if (errorCode == 'auth/user-not-found') {
                    this.auth.createUserWithEmailAndPassword(email, password)
                        .then(a => {
                            // console.log("firebaseLogin_ifNot => firebase login => firebase create(register) => auto login success");
                            this.firebaseXapiRegistered();
                            this.firebaseXapiLogin();
                        })
                        .catch(error => {
                            // Handle Errors here.
                            var errorCode = error['code'];
                            var errorMessage = error['message'];
                            // console.log(`errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
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
        // console.log("firebaseXapiRegistered: going to update uid", this.user.id, firebaseUser.uid);

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
            // console.log("firebaseOnAuthStateChanged(): user just logged out or page refreshed");
            // this.userUpdate({status: 'offline'});
            this.endUserIdleTracking();
            this.firebaseAuthChange.next(false);
            this.chat.onFirebaseLogout();
            this.firebaseLogin = false;
        }

    }

    /**
     * Updates user data on firebae database.
     * @param data User data object. This is can be a field or combination of fields.
     * @param callback callback
     * @code app.userUpdate({ name: 'myName' }, () => {});
     */
    userUpdate(data, callback?) {
        this.share.userUpdate(data, callback);
    }
    userUpdateProfile() {
        let data = {
            // email: this.user.email,
            name: this.user.name,
            photoUrl: this.user.photoURL,
            status: 'online',
            xapiUid: this.user.id
        };
        this.userUpdate(data);
    }


    /**
     * It updates every track timeout.
     *
     * @note @attention if you only update when it is not 'online', it works no good on cordova-android.
     *
     */
    userOnline() {
        // if ( this.myStatus === 'online' ) return;
        this.myStatus = 'online';
        this.userUpdate({ status: this.myStatus, lastOnline: (new Date).getTime() });
    }

    /**
     * Sets the user offline.
     * @note for 'offline', it always updates to database since it is not often happens.
     * @param callback callback
     */
    userOffline(callback) {
        this.myStatus = 'offline';
        this.userUpdate({ status: this.myStatus }, callback);
    }
    /**
     * Sets the user 'away'
     * @note for 'away', it always updates to database since it is not often happens as 'online'.
     */
    userAway() {
        this.myStatus = 'away';
        this.userUpdate({ status: this.myStatus });
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
     * @deprecated use share.setCache()
     * @param key
     * @param value
     */
    cacheSet(key, value) {
        // this.storage.set(key, value);
        this.share.setCache(key, value);
    }
    /**
     *
     *
     * @deprecated use share.getCache()
     *
     * @param key Key
     * @return null if there is no data.
     */
    cacheGet(key) {
        // return this.storage.get(key);
        return this.share.getCache(key);
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
        else return this.anonymousPhotoURL;
    }

    /**
     * Returns user photo URL or default photo url.
     * @param url user photo URL
     */
    photoUrl(url) {
        if (url) return url;
        else return this.anonymousPhotoURL;
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
        this.share.go(url);
        this.rerenderPage(10);
    }
    goHome() {
        this.share.go('/');
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
                // console.log("AppService::onConnect() ==> connected")
            }
            else { // disconnected. offline.
                /// cannot write any code here. this will not work.
            }
        });
    }
    beginUserIdleTracking() {
        this.trackMouseMove = this.trackAction('mousemove');
        this.trackScroll = this.trackAction('scroll');
        this.trackKeyup = this.trackAction('keyup');
        this.resetTimerAway(); // begin tracking immediately after loading ( 처음 로드 하자 마자 한번 호출. )
    }
    trackAction(action) {
        return Observable.fromEvent(document, action)
            .throttleTime(this.throttleUserAction)
            .subscribe(e => this.userAction());
    }
    userAction() {
        // console.log("userAction");
        this.userOnline();          // then, set user online
        this.resetTimerAway();  // reset timer.
    }
    resetTimerAway() {
        if (this.timerAway) this.timerAway.unsubscribe();
        this.timerAway = Observable.timer(this.throttleOut) // if no mouse move in 3 minuts,
            .subscribe(e => {          // then, set user away. until the user closes the app. or logs out.
                this.userAway();
            });
    }
    endUserIdleTracking() {
        if (this.trackMouseMove) this.trackMouseMove.unsubscribe();
        if (this.timerAway) this.timerAway.unsubscribe();
    }




    scrollTo(id, selector) {
        // console.log("clicked id: ", id);
        let parts = this.getSelectorParts(selector);
        // console.log('parts::', parts);
        if (parts && parts.length) {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i]['id'] == id) {
                    // console.log("top of the section: ", parts[i]['top']);
                    let p = parts[i]['top'] - this.headerHeight;
                    // console.log('scroll To Y: ', p);
                    // console.log("headerHeight: ", this.headerHeight);
                    this.scrollToY(p);
                    break;
                }
            }
        }
        return;
    }

    /**
     * Returns the array of 'section#names' and its top position in the document.
     *
     */
    getSelectorParts( selector ) {
        // console.log('selector::', selector);
        let nodes = document.querySelectorAll( selector );
        // console.log('nodes::', nodes);
        let nodesArray = Array.from(nodes);
        // console.log('nodesArray::', nodesArray);
        let parts = [];
        if (nodesArray && nodesArray.length) {
            for (let i = 0, len = nodesArray.length; i < len; i++) {
                let el = nodesArray[i];
                let pos = this.getOffset(el);
                // console.log('el::pos', el);
                parts.push({ id: el['id'], top: pos.top });
            }
        }
        return parts;
    }



    /**
     *
     *
     * @code
     *          this.scrollToY( parts[i]['top'] - HEADER_HEIGHT );
     *          scrollToY(0, 1500, 'easeInOutQuint');
     * @endcode
     *
     * @attention the speed and ease does not look like working.
     * @param speed -
     * @param easing - easeOutSine, easeInOutSine, easeInOutQuint
     */
    scrollToY(scrollTargetY, speed?, easing?) {

        // first add raf shim
        // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        window['requestAnimFrame'] = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window['mozRequestAnimationFrame'] ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();


        // scrollTargetY: the target scrollY property of the window
        // speed: time in pixels per second
        // easing: easing equation to use

        var scrollY = window.pageYOffset,
            scrollTargetY = scrollTargetY || 0,
            speed = speed || 1000,
            easing = easing || 'easeOutSine',
            currentTime = 0;

        // min time .1, max time .8 seconds
        var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        var easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

        // add animation loop
        function tick() {
            currentTime += 1 / 60;

            var p = currentTime / time;
            var t = easingEquations[easing](p);

            if (p < 1) {
                window['requestAnimFrame'](tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
            }
        }

        // call it once to get started
        tick();
    }


    /**
     * To get offset of an element.
     */
    getOffset(el) {
        el = el.getBoundingClientRect();
        return {
            left: Math.round(el.left + window.pageYOffset),
            top: Math.round(el.top + window.pageYOffset)
        };

    }

}
