import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as firebase from 'firebase';

import { Base } from './../etc/base';
import { UserService } from './wordpress-api/user.service';

import { AlertModalService } from './modals/alert/alert.modal';

const USER_TOKEN_KEY = 'user-token';


import { Observable } from 'rxjs/Observable';

declare let FCMPlugin;

@Injectable()
export class PushMessageService extends Base {
    private messaging: firebase.messaging.Messaging;
    constructor(
        private http: Http,
        private user: UserService,
        public alert: AlertModalService
    ) {
        super();
        /// init
        this.messaging = firebase.messaging();
        this.initWeb();
    }

    initWeb() {
        if (this.isCordova) return;

        this.updateWebToken();
        this.messaging.onMessage((payload) => {
            alert(payload['notification']['title'] + "\n" + payload['notification']['body']);
            // location.href = payload['notification']['click_action'];
        });

    }

    updateWebToken() {

        if (this.isCordova) return;
        if (!this.user.isLogin) return;
        this.request();

    }



    /**
     * This is needed to be run only one time after device ready.
     */
    initCordova() {
        if (!this.isCordova) return;
        console.log('initCordova()');

        this.updateCordovaToken();

        // FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
        // Here you define your application behaviour based on the notification data.
        FCMPlugin.onNotification((data) => {
            console.log("...Notification: ", data);
            if (data.wasTapped) {
                // Notification was received on device tray and tapped by the user.
                alert(JSON.stringify(data));
            } else {
                // Notification was received in foreground. Maybe the user needs to be notified.
                alert(JSON.stringify(data));
            }
        }, e => console.error(e));
    }



    /**
     * We update token every time user logs in.
     * 
     * @note reason 1. push token is saved on user meta.
     * @note reason 2. Do we really need to broadcast a message to all user?
     * 
     */
    updateCordovaToken() {
        if (!this.isCordova) return;
        if (!this.user.isLogin) return;



        console.log('updateCordovaToken()');

        // FCMPlugin.getToken( successCallback(token), errorCallback(err) );
        // Keep in mind the function will return null if the token has not been established yet.
        FCMPlugin.getToken((token) => {
            console.log("FCM Token:", token);
            this.updateMyToken(token);
            // this.user.auth.onAuthStateChanged(user => {
            //     let uid = user ? user.uid : null;
            //     console.log("cordovaInit() => getToken() => onAuthStateChanged: ", uid);
            //     this.updateToken(uid, token).then(() => this.tokenUpdated(token))
            // });
        });

    }

    request() {
        // console.log('PushMessageService::request()');
        this.messaging.requestPermission().then(() => {
            this.messaging.getToken()
                .then((currentToken) => {
                    if (currentToken) {
                        //
                        console.log("Got push token: ", currentToken);
                        // if (currentToken == this.getMyToken()) {
                        //     console.log("User token has not changed. so, not going to update");
                        //     return;
                        // }
                        console.log("User token has chagned. so, going to update.");
                        this.updateMyToken(currentToken);
                        // this.updateToken(uid, currentToken).then(() => this.tokenUpdated(currentToken))

                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch(function (err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
        })
            .catch(e => {
                if (e && e['code']) {
                    switch (e['code']) {
                        case 'messaging/permission-default': /// user closed permission popup box by clicking 'x' button.
                            console.log('user closed permission popup box by clicking "x" button.');
                            break;
                        case 'messaging/permission-blocked': /// user blocked
                            console.log('user blocked push message');
                            break;
                        default: ///
                            console.log(e);
                    }
                } else {
                    console.log('Unable to get permission to notify. ( It does not look like firebase error )', e);
                }
            });

    }


    getMyToken() {
        let key = USER_TOKEN_KEY;
        return this.storage.get(key);
    }

    updateMyToken(token) {
        return this.user.update_user_meta('pushToken', token).subscribe(key => {
            console.log("token Update success: user_meta_update: key: ", key);
            this.storage.set(USER_TOKEN_KEY, token);
        }, err => this.alert.error(err))
    }



    send(tokenTo, title, body, url?): Observable<any> {

        if (tokenTo == this.getMyToken()) return Observable.throw(new Error('my-token'));

        if (!url) url = "https://www.sonub.com";
        let data =
            {
                "notification": {
                    "title": title,
                    "body": body,
                    "icon": "https://www.iamtalkative.com/assets/images/logo/logo-icon.png",
                    "click_action": url
                },
                "to": tokenTo
            };
        return this.http.post("https://fcm.googleapis.com/fcm/send", data, this.requestOptions);
    }

    get requestOptions(): RequestOptions {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': "key=AAAALbd78tk:APA91bFAWHYdlihD2ACgug0qE6RXjn28E7dVkBItE-fzXFB27TmmlGnl31JdmdHauJpLu0T8QPGRY6xIuORyYVR1Q-swFb9IQlVQlgpB_hjwNdNbm_0EodlLvW_B9-zdJ-obffThlto_"
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }

}
