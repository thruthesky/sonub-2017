import { Injectable } from '@angular/core';
import { Base } from '../../etc/base';
import { ERROR, error } from './../../etc/error';
import { WordpressApiService } from './wordpress-api.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/observable/throw';




import {
    POST_CREATE, POST_UPDATE, POST_DATA, POST, POSTS,
    POST_DELETE, POST_LIST, POST_LIST_RESPONSE, PAGE,
    POST_SEARCH, POST_SEARCH_RESPONSE,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE, POST_CREATE_RESPONSE,
    COMMENT_UPDATE, COMMENT_UPDATE_RESPONSE, COMMENT_DATA, COMMENT_DATA_RESPONSE,
    CATEGORIES,
    POST_DELETE_RESPONSE,
    COMMENT_DELETE, COMMENT_DELETE_RESPONSE,
    FILE,
    SITE_PREVIEW

} from './interface';


@Injectable()
export class ForumService extends Base {


    constructor(
        private domSanitizer: DomSanitizer,
        private wp: WordpressApiService,
        private user: UserService,
        // private ngZone: NgZone
    ) {
        super();
    }



    postCreate(data: POST_CREATE): Observable<POST_CREATE_RESPONSE> {
        data.session_id = this.user.sessionId;
        data.route = 'post.create';
        // console.log(data);
        return this.wp.post(data);
    }
    postData(post_ID): Observable<POST> {
        let data: POST_DATA = {
            session_id: this.user.sessionId,
            route: 'wordpress.get_post',
            ID: post_ID,
            thumbnail: '200x200'
        };
        return this.wp.post(data)
            // .map( v => {
            //     setTimeout(() => this.ngZone.run(()=>{}), 100);
            //     return v;
            // })
            // .map(v => this.parepareData(v));
    }

    // parepareData(data) {
    //     data['shortDate'] = this.shortDate(data.meta.timestamp_create);
    //     return data;
    // }

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


    postLatest(category_name, no_of_posts = 10): Observable<POSTS> {
        return this.postList({ category_name: category_name, paged: 1, posts_per_page: no_of_posts })
            .map((p: PAGE) => p.posts);
    }
    postPopular() {

    }


    /**
     *
     * @example test.service.ts
     * @param req Comment create data
     */
    commentCreate(req: COMMENT_CREATE): Observable<COMMENT_CREATE_RESPONSE> {
        if (!this.user.isLogin) return Observable.throw(error(ERROR.LOGIN_FIRST));

        let data = Object.assign({}, req);
        data.route = 'wordpress.wp_new_comment';
        data.session_id = this.user.sessionId;
        return this.wp.post(data);
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


    postUrl(id: number): string {
        return super.postUrl(id);
    }


    getFirstImage(post: POST): FILE {
        if ( post && post.files && post.files.length) {
            for (let file of post.files) {
                if (file.type.indexOf('image') == -1) continue;
                else return file;
            }
        }
        return null;
    }

    getFirstImageUrl(post: POST) {
        let file = this.getFirstImage(post);
        if (file) return file.url;
        else return null;
    }

    getFirstImageThumbnailUrl(post: POST) {
        let file = this.getFirstImage(post);
        if (file) return file.url_thumbnail;
        else return null;
    }


    preview(url: string): Observable<SITE_PREVIEW> {
        return this.wp.post({ route: 'wordpress.site_preview', session_id: this.user.sessionId, url: url });
    }
    deletePreview(id: number): Observable<SITE_PREVIEW> {
        return this.wp.post({ route: 'wordpress.delete_site_preview', session_id: this.user.sessionId, id: id });
    }


    /**
     * This does pre-processing for a post.
     *
     * @attention @warning 'post_content' is sanitized and saved at *post_content_pre*
     *
     * @param post - the post. call by reference.
     * @param o - options
     *          o['safe'] - if it is set to true, it does domSanitizing.
     *          o['autolink'] - if it is set to true, then URL in content will become clickable A tags.
     *
     * @return post - it's call by reference so, no need to save the return value unless you need.
     * @code
     *  this.app.forum.pre( post );
     * @endcode
     */
    pre(post: POST): POST {
        post.post_content_pre = this.htmlify(post.post_content, { safe: true, autolink: true });
        post.post_content_pre = <any>this.domSanitizer.bypassSecurityTrustHtml(post.post_content_pre);
        return post;
    }

    /**
     * Does 'pre' process for page.
     * @param page page from server
     * @param o options
     * @example
     *      this.app.forum.prePage( page );
     *
     */
    prePage(page: PAGE ) {
        if (page.posts && page.posts.length) {
            for (let i = 0; i < page.posts.length; i++) {
                page.posts[i] = this.pre(page.posts[i]);
            }
        }
    }
}
