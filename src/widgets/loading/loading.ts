import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../../providers/app.service';

@Component({
    selector: 'loading-widget',
    templateUrl: 'loading.html'
})

export class LoadingWidget implements OnInit {
    @Input() text = null;
    default = this.app.text('loading');
    constructor(
        public app: AppService
    ) { }

    ngOnInit() {
        
    }
}