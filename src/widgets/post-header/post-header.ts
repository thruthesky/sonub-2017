import { Component, Input, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'post-header-widget',
    templateUrl: 'post-header.html'
})

export class PostHeaderWidget implements OnInit {

    @Input() post;

    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}