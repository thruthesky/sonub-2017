import { Component, OnInit } from '@angular/core';
import { AppService } from '../../providers/app.service';

@Component({
    selector: 'activity-widget',
    templateUrl: 'activity.html'
})

export class ActivityWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}