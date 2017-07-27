import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { ERROR } from '../../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';



import {
    POST_CREATE, POST_UPDATE, POST_DATA, POST, POST_DELETE, POST_LIST, POST_LIST_RESPONSE,
    POST_SEARCH, POST_SEARCH_RESPONSE,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE, POST_CREATE_RESPONSE,
    COMMENT_UPDATE, COMMENT_UPDATE_RESPONSE, COMMENT_DATA, COMMENT_DATA_RESPONSE,
    CATEGORIES,
    POST_DELETE_RESPONSE,
    COMMENT_DELETE, COMMENT_DELETE_RESPONSE
} from './interface';


@Injectable()
export class ForumService extends Base {


    constructor(
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }



    postCreate(data: POST_CREATE): Observable<POST_CREATE_RESPONSE> {
        data.session_id = this.user.sessionId;
        data.route = 'post.create';
        // console.log(data);
        return this.wp.post(data);
    }
    postData(no): Observable<POST> {
        let data: POST_DATA = {
            session_id: this.user.sessionId,
            route: 'wordpress.get_post',
            ID: no,
            thumbnail: '200x200'
        };
        return this.wp.post(data);
    }

    postUpdate(data: POST_UPDATE): Observable<number> {
        data.session_id = this.user.sessionId;
        data.route = 'post.update';
        return this.wp.post(data);
    }


    postDelete(req: POST_DELETE): Observable<POST_DELETE_RESPONSE> {
        req.session_id = this.user.sessionId;
        req.route = 'wordpress.delete_post';
        // debugger;
        // console.log( this.user.sessionId );
        return this.wp.post(req);
    }

    postList(req: POST_LIST): Observable<POST_LIST_RESPONSE> {
        return this.wp.query(req)
    }

    postSearch(req: POST_SEARCH): Observable<POST_SEARCH_RESPONSE> {
        return this.wp.query(req)
    }


    postLatest(category_name, no_of_posts) {
        return this.postList({ category_name: category_name, paged: 1, posts_per_page: no_of_posts });
    }
    postPopular() {

    }


    /**
     * 
     * @example test.service.ts
     * @param req Comment create data
     */
    commentCreate(req: COMMENT_CREATE): Observable<COMMENT_CREATE_RESPONSE> {
        if ( ! this.user.isLogin ) return Observable.throw( new Error('login-before-comment') );
        req.route = 'wordpress.wp_new_comment';
        req.session_id = this.user.sessionId;
        return this.wp.post(req);
    }

    commentUpdate(req: COMMENT_UPDATE): Observable<number> {
        req.route = 'wordpress.wp_update_comment';
        req.session_id = this.user.sessionId;
        return this.wp.post(req);
    }

    commentData(comment_ID): Observable<COMMENT_DATA_RESPONSE> {
        let req: COMMENT_DATA = {
            route: 'wordpress.get_comment',
            session_id: this.user.sessionId,
            comment_ID: comment_ID,
            thumbnail: '200x200'
        };
        return this.wp.post(req);
    }


    commentDelete(comment_ID: number): Observable<COMMENT_DELETE_RESPONSE> {
        let req: COMMENT_DELETE = {
            route: 'wordpress.wp_delete_comment',
            session_id: this.user.sessionId,
            comment_ID: comment_ID
        };
        return this.wp.post(req);
    }


    getCategories(): Observable<CATEGORIES> {
        return this.wp.post({ route: 'wordpress.get_categories' });
    }




}
