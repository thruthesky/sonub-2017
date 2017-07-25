import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Base } from './../etc/base';

import { config } from './../app/config';



import { WordpressApiService } from './wordpress-api/wordpress-api.service';
import { UserService } from './wordpress-api/user.service';
import { ForumService } from './wordpress-api/forum.service';
import { FileService } from './wordpress-api/file.service';






@Injectable()
export class AppService extends Base {
    config = config;
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    constructor(
        public user: UserService,
        public forum: ForumService,
        public wp: WordpressApiService,
        public file: FileService,
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
     * @deprecated use .warning();
     * @note all kinds of error will be displayed here.
     * @attention Input object must have a property of 'code' for error code and 'message' for explanation of the error.
     * @param e Error object or can be a string.
     */
    displayError(e) {
        let msg;
        if (typeof e === 'string') msg = e;
        else {
            let code = e['code'] || '';
            let message = e['message'] || '';
            msg = `${code}: ${message}`;
        }
        alert(msg);
    }

    warning(e) {
        return this.displayError(e);
    }
    confirm( title ) {
        return confirm(title);
    }
    input( title ) {
        return prompt(title);
    }
}
