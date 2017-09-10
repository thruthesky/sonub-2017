import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Base } from './../../etc/base';
import { ShareService } from './../../providers/share.service';
import { UserService } from './user.service';
import { getLanguage, setLanguage } from './../../etc/language';
import { ErrorService } from './../error.service';

@Injectable()
export class PageService extends Base {

    links: Array<Node> = [];

    constructor(
        private http: HttpClient,
        private user: UserService,
        private share: ShareService,
        private error: ErrorService,
    ) {
        super();
    }

    /**
     * It gets an HTML page from server and displays to view
     * @param pageName page name to get a page from server
     */
    load(pageName: string, params?: any): Observable<string> {
        return this.http.get(this.getUrl(pageName, params), { responseType: 'text' })
            .map(e => {
                this.share.rerenderPage(50);
                return e;
            });
    }

    /**
     * Returns page data from backend.
     * @logic
     *      1. This method will return cached data through the callback function
     *      2. After that, this method will get data from server.
     *      3. If the data from backend and the data from cache are same, then it don't do anything.
     *      4. Retrun data from backend through the callback function.
     *      5. Update cache.
     * 
     * @note [routerLink] will work on the dynamic loaded HTML.
     * 
     * @param pageName Page name to get from serer
     * @param params params
     * @param callback Callback function. Important: this callback function will be called twice.
     */
    cache(pageName: string, params: any, callback) {
        let url = this.getUrl(pageName, params);
        let cache = this.share.getCache(url);
        if (cache) {
            // console.log("RETURN CACHED DATA: ", cache);
            let safe = this.share.safe(cache);
            callback(safe);
        }

        this.load(pageName, params).subscribe(html => {
            if (html === cache) {
                // console.log("DATA SAME: Don't do anything");
                return;
            }
            let safe = this.share.safe(html);
            callback(safe);
            this.share.setCache(url, html);
            // console.log("Set Cache data: key: ", html);
        }, e => {
            console.error(e);
        });
    }

    getUrl(pageName, params): string {
        let url = this.serverUrl + '/wp-content/plugins/xapi-2/pages/page.php?name=' + pageName;
        url += '&ln=' + getLanguage();
        url += '&session_id=' + this.user.sessionId;
        url += '&' + this.http_build_query(params);
        url += '&platform=' + this.share.getPlatform();
        return url;
    }




}