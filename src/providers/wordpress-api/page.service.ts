import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Base } from './../../etc/base';

import { UserService } from './user.service';


import { getLanguage, setLanguage } from './../../etc/language';



@Injectable()
export class PageService extends Base {

    constructor(
        private domSanitizer: DomSanitizer,
        private http: HttpClient,
        private user: UserService
    ) {
        super();
     }

    /**
     * It gets an HTML page from server and displays to view
     * @param pageName page name to get a page from server
     */
    load(pageName: string, params?: any) {
        
        let url = this.serverUrl + '/wp-content/plugins/xapi-2/pages/page.php?name=' + pageName + '&ln=' + getLanguage();
        url += '&session_id=' + this.user.sessionId;
        url += '&' + this.http_build_query( params );
        // console.log('page: ', url);
        return this.http.get(url, { responseType: 'text' })
            .map(e => this.domSanitizer.bypassSecurityTrustHtml(e) as string);
    }

}