import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';


import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/throttleTime';



import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { DomSanitizer } from '@angular/platform-browser';




import { UserService } from './wordpress-api/user.service';
import { ForumService } from './wordpress-api/forum.service';
import { Base } from './../etc/base';




import * as firebase from 'firebase/app';

import {
    ACTIVITY, ACTIVITIES, COMMUNITY_LOGS, COMMUNITY_LOG
} from './wordpress-api/interface';

export interface TOAST_OPTIONS {
    content: string;
    className?: string;
    callback?: any;
    delay?: number; /// to delay before toast.
    show?: boolean;
    timeout?: number; /// to hide after toast.

};

@Injectable()
export class ShareService extends Base {


    /// for listening new activity logs and community logs from firebase database.
    firebaseDatabaseListenActivityEventHandler = null;
    activity: ACTIVITIES = [];
    communityLogs: COMMUNITY_LOGS = [];

    /// toast
    toastOption: TOAST_OPTIONS = {
        show: false,
        content: '',
        className: '',
        callback: () => {}
    };



    /// page width
    width = 0;





    constructor(
        private ngZone: NgZone,
        private router: Router,
        private domSanitizer: DomSanitizer,
        public user: UserService,
        public forum: ForumService
    ) {
        super();



        Observable.fromEvent(window, 'resize')
            .debounceTime(100)
            .subscribe((event) => {
                this.width = window.innerWidth;
            });

        this.width = window.innerWidth;

    }


    rerenderPage(timeout?, callback?) {
        if (timeout) {
            setTimeout(() => this.ngZone.run(() => {
                if ( callback ) callback();
            }), timeout);
        }
        else this.ngZone.run(() => {
            if ( callback ) callback();
        });
    }


    logout() {
        this.user.logout();
        this.userOffline(() => {
            this.auth.signOut();
        });
        this.bootstrapLoginLogout();
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


    userUpdate(data, callback?) {
        if (this.userLocation) this.userLocation.update(data).then(() => {
            if (callback) callback();
        });
    }


    get userLocation(): firebase.database.Reference {
        if (this.auth && this.auth.currentUser && this.auth.currentUser.uid) {
            return this.db.child('users').child(this.auth.currentUser.uid);
        }
        else return null;
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
        // console.log("ShareService::bootstrapLoginLogout()")
        this.listenFirebaseUserActivity();
    }



    get size(): 'mobile' | 'break-a' | 'break-c' | 'break-d' {
        if (this.width < 600) return 'mobile';
        else if (this.width < 840) return 'break-a';
        else if (this.width < 1140) return 'break-c';
        return 'break-d';
    }


    /// toast
    toastLog(val, type) {

        // console.log("toastLog: width: ", this.width);
        // console.log("toastLog: size: ", this.size);

        if (this.size == 'break-d') return; // don't toast on wide space.

        let toastOption: TOAST_OPTIONS = {
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


    toast(option: TOAST_OPTIONS) {
        // console.log(`app.toast()`, option);
        if (option.delay === void 0) option.delay = 1;
        setTimeout(() => {
            this.toastOption = option;
            this.toastOption.show = true;
            if (option.timeout !== void 0) {
                setTimeout(() => this.toastClose(), option.timeout);
            }
            this.rerenderPage();
        }, option.delay);
    }

    toastClose() {
        this.toastOption.show = false;
        this.rerenderPage();
    }

    onClickToast() {
        if ( this.toastOption.callback ) this.toastOption.callback()
    }


    /// post

    postView(post_ID) {
        this.router.navigateByUrl(this.forum.postUrl(post_ID));
    }



    /// firebase



    listenFirebaseUserActivity() {
        // console.log("ShareService::listenFirebaseUserActivity()")
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



    go(url) {
        console.log("go: ", url);
        this.router.navigateByUrl(url);
    }



    /**
     * Returns a string if the user logged into firebase.
     * @return  - a string if logged in
     *          - null if not logged in.
     */
    get isFirebaseLogin(): string {
        if (this.auth && this.auth.currentUser && this.auth.currentUser.uid) {
            return this.auth.currentUser.uid;
        }
        else return null;
    }
    get firebaseUid(): string {
        return this.isFirebaseLogin;
    }
    



    getPlatform(): string {
        if ( this.isCordova ) return 'cordova';
        else return 'web';
    }
    

    safe( html ): string {
        return this.domSanitizer.bypassSecurityTrustHtml(html) as string;
    }


}