import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Base } from './base';

import { config } from './../app/config';

import { UserService, SOCIAL_PROFILE } from './user.service';
export { SOCIAL_PROFILE } from './user.service';

import { WordpressApiService } from './wordpress-api.service';




@Injectable()
export class AppService extends Base {
    config = config;
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    constructor(
        public user: UserService,
        public wp: WordpressApiService,
        private ngZone: NgZone,
        private router: Router
    ) {
        super();
        console.log("AppService::constructor()");
        this.auth = firebase.auth();
        this.db = firebase.database().ref('/');
    }




    /**
     * Display erorr.
     * @note all kinds of error will be displayed here.
     * @attention Input object must have a property of 'code' for error code and 'message' for explanation of the error.
     * @param e Error object
     */
    displayError(e) {

        /// for firebase and other error
    
    
        let code = e['code'] || '';
        let message = e['message'] || '';
        let msg = `${code}: ${message}`;
        alert( msg );
    }
}
