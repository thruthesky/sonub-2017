import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'post-header-widget',
    templateUrl: 'post-header.html'
})

export class PostHeaderWidget implements OnInit {

    @Input() post;
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();


    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}