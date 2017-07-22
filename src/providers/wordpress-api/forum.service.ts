import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { ERROR } from '../../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';


import { POST_CREATE, POST_UPDATE, POST_DATA } from './interface';


@Injectable()
export class ForumService extends Base {


    constructor(
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }



    postCreate(data: POST_CREATE): Observable<number> {
        data.session_id = this.user.userProfile.session_id;
        data.route = 'post.create';
        // console.log(data);
        return this.wp.post(data);
    }
    postData(no) {
        let data: POST_DATA = {
            session_id: this.user.userProfile.session_id,
            route: 'wordpress.get_post',
            post_ID: no
        }
        return this.wp.post(data);
    }

    postUpdate(data: POST_UPDATE): Observable<number> {
        data.session_id = this.user.userProfile.session_id;
        data.route = 'post.update';
        return this.wp.post(data);
    }

    postDelete() {

    }

    commentCreate() {

    }
    commentData() {

    }
    commentUpdate() {

    }
    commentDelete() {

    }

    page() {

    }
}
