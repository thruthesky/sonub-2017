import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { Base } from './base';

import { USER_REGISTER, USER_REGISTER_RESPONSE } from './user.service';

@Injectable()
export class TestService extends Base {

    constructor(
        private app: AppService
    ) {

        super();
        // app.wp.getPosts().subscribe( data => console.log(data) );



        this.testApi();
        this.testRegister();
    }


    test(re, msg?) {
        if (re) this.good(msg);
        else this.bad(msg);
    }

    good(msg) {
        console.log(`GOOD: ${msg}`);
    }
    bad(msg) {
        console.log(`BAD: ${msg}`);
    }

    testApi() {
        this.app.wp.post({}).subscribe(
            res => this.bad("Api call with missing-route must befailed"),
            err => this.test( err.code == 'route_is_empty', "route is missing.")
        );

        this.app.wp.post({ route: 'wrong.route' }).subscribe(
            res => this.bad("Api call with empty session id must befailed"),
            err => { this.test( err.code == 'session_id_is_empty', "session id is empty."); }
        );

        this.app.wp.post({ route: 'wrong.route', session_id: '-session-id' }).subscribe(
            res => this.bad("Api call with wrong-route must befailed"),
            err => { this.test( err.code == 'class_does_not_exist', "class does not exists"); }
        );
        this.app.wp.post({ route: 'user.wrongMethod', session_id: '-session-id' }).subscribe(
            res => this.bad("Api call with wrong-method must befailed"),
            err => { this.test( err.code == 'method_does_not_exist', "method does not exists"); }
        );

    }

    testRegister() {

        this.app.user.register(<any>{}).subscribe(res => {
            this.bad('Empty user_login must be failed for register.')
        }, error => {
            // console.log("ERROR: ", error);
            this.test(error.code == 'user_login_is_empty', 'user login is empty.');
        });


        let data: USER_REGISTER = <USER_REGISTER>{
        };

        this.app.user.register(<any>{ user_login: this.randomString() }).subscribe(res => {
            this.bad('Empty password must be failed for register.')
        }, error => {
            this.test(error.code == 'user_pass_is_empty', 'empty password.');
        });


        this.app.user.register(<any>{ user_login: this.randomString(), user_pass: 'user-pass' }).subscribe(res => {
            this.bad('Empty email must be failed for register.')
        }, error => {
            this.test(error.code == 'user_email_is_empty', 'empty email.');
        });

        // expecting success.

        this.app.user.register(<any>{ user_login: this.randomString(), user_pass: 'user-pass', user_email: this.randomString() + '@gmail.com' }).subscribe(res => {
            console.log(res);
            this.good('User register success: ' + res.session_id);
        }, error => {
            this.bad("Expecting registraion.");
        });


    }


}