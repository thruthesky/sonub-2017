import { Component, OnInit } from '@angular/core';
import { AppService, COMMUNITY_LOG } from '../../providers/app.service';

@Component({
    selector: 'community-log-widget',
    templateUrl: 'community-log.html'
})

export class CommunityLogWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }

    imageUrl( log: COMMUNITY_LOG ) {
        if ( log.thumbnail_url ) return log.thumbnail_url;
        else if ( log.author_photoURL ) return log.author_photoURL;
        else return '';
    }
}