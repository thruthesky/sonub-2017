import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { Base } from '../etc/base';

import { USER_REGISTER, USER_REGISTER_RESPONSE, USER_UPDATE, USER_UPDATE_RESPONSE } from './user.service';

import { POST_CREATE, POST_UPDATE } from './forum.service';

@Injectable()
export class TestService extends Base {

    constructor(
        private app: AppService
    ) {

        super();
        // app.wp.getPosts().subscribe( data => console.log(data) );



        this.testApi();
        this.testRegister();
        this.testLogin(() => this.testPostCreate());

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
            err => {
                // console.log(err);
                this.test(err.code == 'route_is_empty', "route is missing.");
            }
        );

        // this.app.wp.post({ route: 'wrong.route' }).subscribe(
        //     res => this.bad("Api call with empty session id must befailed"),
        //     err => {
        //         // console.log(err);
        //         this.test(err.code == 'session_id_is_empty', "session id is empty.");
        //     }
        // );

        this.app.wp.post({ route: 'wrong.route', session_id: '-session_id' }).subscribe(
            res => this.bad("Api call with wrong-route must befailed"),
            err => {
                // console.log(err);
                this.test(err.code == 'no_user_data_by_that_session_id_on_session_login', "wrong session id");
            }
        );
        // this.app.wp.post({ route: 'user.wrongMethod', session_id: '-session_id' }).subscribe(
        //     res => this.bad("Api call with wrong-method must befailed"),
        //     err => {
        //         // console.log(err);
        //         this.test(err.code == 'method_does_not_exist', "method does not exists"); }
        // );

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
            // console.log(res);
            this.good('User register success: ' + res.session_id);
        }, error => {
            this.bad("Expecting registraion.");
        });


    }



    /**
     * 
     * @param callback Called after complete.
     */
    testLogin(callback) {

        // if ( this.app.user.isLogin ) {
        //     console.log("====> User logged in already");
        // }

        let data: USER_REGISTER = {
            user_login: this.randomString(),
            user_pass: '1234a',
            user_email: this.randomString() + '@gmail.com',
            name: 'DisplayName',
            mobile: '09171231234',
            gender: 'M'
        };
        this.app.user.register(data).subscribe(res => {
            // console.log(res);
            // this.good('User register success: ' + res.session_id);
            this.app.user.login(data.user_login, data.user_pass).subscribe(res => {
                this.good("Login success");
                let data: USER_UPDATE = {
                    user_email: this.randomString() + '@gmail.com',
                    gender: 'F',
                    mobile: '00001114444'
                };
                this.app.user.update(data).subscribe(res => {
                    // console.log('user update:', res);
                    this.app.user.data().subscribe(profile => {
                        // console.log(profile);
                        this.test(profile.gender == 'F', "Update success");
                        callback();
                    }, err => {
                        this.bad(err.message);
                    })

                }, err => {
                    this.bad(err.message);
                });
            }, err => {
                console.log("login error: ", err);
            });

        }, error => {
            console.log("Registration error:", error);
            this.bad("Expecting registraion.");
        });

    }



    testPostCreate() {

        console.log("tesetPostCreate(): ", this.app.user.userProfile);
        let data: POST_CREATE = {
            category: 'abc',
            post_title: 'Just a title - A'
        }
        this.app.forum.postCreate(data).subscribe(postNo => {
            this.test( typeof postNo === 'number', 'post created' );
            let edit: POST_UPDATE = Object.assign( data, { ID: postNo } );
            edit.post_title = 'Edited Title';
            edit.category = 'def';
            this.app.forum.postUpdate( edit ).subscribe( postNo => {
                console.log("post update success");
            }, err => {
                console.log('error:', err);
            })
        }, err => {
            console.log(err);
        });
    }
}