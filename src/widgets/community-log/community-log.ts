import { Component, OnInit } from '@angular/core';
import { AppService } from '../../providers/app.service';

@Component({
    selector: 'community-log-widget',
    templateUrl: 'community-log.html'
})

export class CommunityLogWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}