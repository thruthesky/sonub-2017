import { Injectable } from '@angular/core';
import { Base } from './../../etc/base';
import { UserService } from './user.service';
import { WordpressApiService } from './wordpress-api.service';
import {
POST_QUERY_RESPONSE, POST, POST_DATA, PAGE, PAGES
} from './interface';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class SearchService extends Base {

    constructor(private wp: WordpressApiService,
                private user: UserService) {
        super();
    }

    data(req): PAGES {

        let pages: PAGES = [];

        for(let i = 0; i < req.length; i++) {
            this.doSearch(req[i]).subscribe( res => {
                // console.log('doSearch', res);
                if(res) pages.push(res);
            }, err => {
                // console.log('error on getting data', err);
            });
        }

        return pages;
    }

    doSearch(req): Observable<PAGE> {
        // console.log('REQUEST::', req);
        if ( req['query'] === void 0 ) req['query'] = {};
        req['route'] = "wordpress.post_query";

        return this.wp.post(req);
    }

}
