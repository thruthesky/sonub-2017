import { Injectable } from '@angular/core';
import { Base } from './../../etc/base';
import { UserService } from './user.service';
import { WordpressApiService } from './wordpress-api.service';
import {
    POST_CREATE, POST_QUERY_RESPONSE,
    BUYANDSELL_CREATE, BUYANDSELL, BUYANDSELL_PAGE, POST, POST_DATA
} from './interface';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class BuyAndSellService extends Base {

    constructor(
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }

    create(data: BUYANDSELL_CREATE): Observable<BUYANDSELL> {
        let req: POST_CREATE = this.convertCreate(data);
        return this.wp.post(req);
    }

    data(req: POST_DATA): Observable<BUYANDSELL> {
        return this.wp.post( req )
            .map(e => this.convertPosttToBuyAndSell( e ));
    }

    convertCreate(data: BUYANDSELL_CREATE): POST_CREATE {

        let req: POST_CREATE = {
            category: 'buyandsell',
            post_title: data.title,
            post_content: data.description,
            fid: data.fid
        };

        // META DATA
        req['contact'] = data.contact;

        req.int_1 = data.price;
        req.char_1 = data.usedItem;
        req.char_2 = data.deliverable;

        req.varchar_1 = data.city;
        req.varchar_2 = data.province;
        req.varchar_3 = data.tag;

        req.session_id = this.user.sessionId;
        req.route = 'post.create';
        req.ID  =  data.ID;

        return req;
    }

    search(req): Observable<BUYANDSELL_PAGE> {
        let str = JSON.stringify(req);

        str = str.replace('price', 'int_1');
        str = str.replace('usedItem', 'char_1');
        str = str.replace('deliverable', 'char_2');
        str = str.replace('city', 'varchar_1');
        str = str.replace('province', 'varchar_2');
        str = str.replace('tag', 'varchar_3');

        req = JSON.parse(str);

        if ( req['query'] === void 0 ) req['query'] = {};

        if ( req['query']['clause'] ) req['query']['clause'].push(`post_status = 'publish'`);
        else req['query']['clause'] = [`post_status = 'publish'`];
        req['query']['slug'] = "buyandsell";
        req['route'] = "wordpress.post_query";
        req['thumbnail'] = "200x200";

        // console.log("buyandsell search request: ", req);
        return this.wp.post(req)
            .map(e => this.convertPage(e));
    }

    convertPage(page: POST_QUERY_RESPONSE): BUYANDSELL_PAGE {

        // console.log('convertPage: ', page);
        if ( page.posts && page.posts.length) {
            for (let post of page.posts) {
                this.convertPosttToBuyAndSell(post);
            }
        }
        return <any>page;
    }

    convertPosttToBuyAndSell(post: POST): BUYANDSELL {

        post['title'] = post.post_title;
        post['description'] = post.post_content;

        post['price'] = post.int_1;
        post['usedItem'] = post.char_1;
        post['deliverable'] = post.char_2;

        post['city'] = post.varchar_1;
        post['province'] = post.varchar_2;
        post['tag'] = post.varchar_3;


        post['contact'] = post.meta['contact'];
        post['timestamp_create'] = post.meta['timestamp_create'];

        delete post.post_title;
        delete post.post_content;
        delete post.post_parent;
        delete post.post_date;
        delete post.varchar_1;
        delete post.comment_count;
        delete post.comments;
        delete post.meta;

        delete post.int_1;
        delete post.int_2;
        delete post.int_3;
        delete post.char_1;
        delete post.char_2;
        delete post.char_3;
        delete post.varchar_1;
        delete post.varchar_2;
        delete post.varchar_3;
        delete post.varchar_4;
        delete post.varchar_5;

        return <any>post;
    }

}
