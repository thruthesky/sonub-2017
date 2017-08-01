import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase';

import { Base } from './../etc/base';
import { UserService } from './wordpress-api/user.service';

import { AlertModalService } from './modals/alert/alert.modal';

const USER_TOKEN_KEY = 'user-token';

@Injectable()
export class PushMessageService extends Base {
    private messaging: firebase.messaging.Messaging;
    constructor(
        private user: UserService,
        public alert: AlertModalService
    ) {
        super();
        /// init
        this.messaging = firebase.messaging();

        this.initWeb();
    }

    initWeb() {
        console.log('PushMessageService::initWeb()');
        if (this.isCordova) return;
        console.log("user login: ", this.user.isLogin);
        if (this.user.isLogin) {
            this.request();
        }
    }

    request() {
        console.log('PushMessageService::request()');
        this.messaging.requestPermission().then(() => {
            this.messaging.getToken()
                .then((currentToken) => {
                    if (currentToken) {
                        //
                        console.log("Got token: ", currentToken);
                        if (currentToken == this.getToken()) {
                            console.log("User token has not changed. so, not going to update");
                            return;
                        }
                        console.log("User token has chagned. so, going to update.");
                        this.updateToken( currentToken );
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


    getToken() {
        let key = USER_TOKEN_KEY;
        return this.storage.get( key );
    }

    updateToken(token) {
        return this.user.update_user_meta( 'pushToken', token).subscribe( key => {
            console.log("user_meta_update: key: ", key);
            this.storage.set( USER_TOKEN_KEY, token );
        }, err => this.alert.error( err ) )
    }
}
