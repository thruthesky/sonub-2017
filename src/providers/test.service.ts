import { Injectable } from '@angular/core';

import { AppService } from './app.service';
import { Base } from '../etc/base';

import {
    USER_REGISTER, USER_REGISTER_RESPONSE, USER_UPDATE, USER_UPDATE_RESPONSE,
    POST_CREATE, POST_UPDATE, POST_DATA, POST, POST_LIST,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE,
    COMMENT_UPDATE, COMMENT_UPDATE_RESPONSE
} from './wordpress-api/interface';



@Injectable()
export class TestService extends Base {

    constructor(
        private app: AppService
    ) {

        super();
        // app.wp.getPosts().subscribe( data => console.log(data) );



        this.testApi();
        this.testRegister();
        this.testLogin(() => {

            this.app.user.update_user_metas({sound: 'whaouwhoaou', position: 'back closing'})
                .subscribe( res => this.good('user.update_user_metas'), e => this.bad('failed to update user metas: ' + this.getErrorString(e)));

            this.testPostCreateUpdateGet(() => this.testPostDelete(a => {
                this.testCommentCRUD();
            }))
        });



        this.testQuery();
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

        this.app.wp.post({ route: 'wordpress.error' }).subscribe(res => {
            console.log('res', res);
        }, err => this.test(err.code == -40000, 'error'));
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
            gender: 'M',
            // timezone_offset: this.getTimezoneOffset()
        };
        this.app.user.register(data).subscribe(res => {
            // console.log(res);
            // this.good('User register success: ' + res.session_id);
            this.app.user.login(data.user_email, data.user_pass).subscribe(res => {
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



    testPostCreateUpdateGet(callback) {
        // console.log("tesetPostCreate(): ", this.app.user.userProfile);
        let data: POST_CREATE = {
            category: 'abc',
            post_title: 'Just a title - A'
        }
        this.app.forum.postCreate(data).subscribe(postNo => {
            this.test(typeof postNo === 'number', 'post created');
            let edit: POST_UPDATE = Object.assign(data, { ID: postNo });
            edit.post_title = 'Edited Title';
            edit.category = 'def';
            this.app.forum.postUpdate(edit).subscribe(postNo2 => {
                this.test(postNo == postNo2, `post update. postNo: ${postNo2}`);

                this.app.forum.postData(postNo2).subscribe(post => {
                    this.test(data.post_title == post.post_title, "post update success");
                    callback();
                }, err => {
                    console.log(err);
                });
            }, err => {
                console.log('error:', err);
            })
        }, err => {
            console.log(err);
        });
    }

    testPostDelete(callback) {
        this.postCreate(id => {
            this.postData(id, post => {
                // console.log("testPostDelete => before delete: ", post);
                this.postDelete(id, deletedID => {
                    this.postData(deletedID, deletedPost => {
                        // console.log("testPostDelete => after delete: ", deletedPost );
                        callback();
                    });
                });
            });
        });
    }


    testQuery() {
        this.app.forum.postList({ category_name: 'abc', paged: 2, posts_per_page: 5 }).subscribe(res => {
            console.log('query: ', res);
        }, err => console.error(err));
        this.app.forum.postSearch({ s: '5544', category_name: 'abc', paged: 1, posts_per_page: 5 }).subscribe(res => {
            console.log('search query: ', res);
        }, err => console.error(err));

    }

    testCommentCRUD() {
        this.postCreate(ID => {
            this.commentCreate(ID, 0, re => {
                console.log("commentCreate: ", re);
                let comment_ID = re.comment_ID;
                // this.commentCreate( ID, comment_ID, comment_comment_ID => {
                //     this.postData( ID, post => {
                // console.log(post);
                // });
                // } )

                this.commentUpdate(comment_ID, 'This is updated content.', comment_ID => {
                    this.good("comment updated: " + comment_ID);
                    this.commentData(comment_ID, comment => {
                        // console.log(comment);
                        this.commentDelete(comment_ID, res => {
                            let deleted_ID = res.comment_ID;
                            this.test(comment_ID == deleted_ID, "comment deleted.");
                            this.commentData(deleted_ID, deleted_comment => {
                                // console.log("deleted coment:", deleted_comment);
                            });
                        });
                    });
                });
            });

        });
    }


    postCreate(callback) {
        let data: POST_CREATE = {
            category: 'abc',
            post_title: 'POST TITLE: ' + this.randomString()
        };
        this.app.forum.postCreate(data).subscribe(postNo => {
            callback(postNo);
        }, err => {
            console.log(err);
        });
    }

    postData(no, callback: (post: POST) => void) {
        this.app.forum.postData(no).subscribe(post => {
            callback(post);
        }, err => {
            console.log(err);
        });
    }
    postDelete(no, callback) {
        this.app.forum.postDelete({ ID: no }).subscribe(res => {
            callback(res.ID);
        }, err => {
            console.log(err);
        });
    }

    commentCreate(ID, parent_comment_ID, callback) {

        let req: COMMENT_CREATE = {
            comment_post_ID: ID,
            comment_parent: parent_comment_ID || 0,
            comment_content: 'comment' + this.randomString()
        };

        this.app.forum.commentCreate(req).subscribe(re => {
            // console.log("comment created", id);
            callback(re);
        }, err => this.bad(this.getErrorString(err)));
    }

    commentUpdate(comment_ID, content, callback) {
        let req: COMMENT_UPDATE = {
            comment_ID: comment_ID,
            comment_content: content
        };
        this.app.forum.commentUpdate(req).subscribe(id => callback(id), err => this.bad(this.getErrorString(err)));
    }

    commentData(comment_ID, callback) {
        this.app.forum.commentData(comment_ID).subscribe(comment => callback(comment), err => this.bad(this.getErrorString(err)));
    }

    commentDelete(comment_ID, callback) {
        this.app.forum.commentDelete(comment_ID).subscribe(comment => callback(comment), err => this.bad(this.getErrorString(err)));
    }


}