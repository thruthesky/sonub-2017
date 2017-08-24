import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'post-header-widget',
    templateUrl: 'post-header.html'
})

export class PostHeaderWidget implements OnInit {

    @Input() post;
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();


    @ViewChild('p') public popover: NgbPopover;

    userName;
    constructor(
        public app: AppService
    ) { }

    ngOnInit() {
        this.userName = this.app.postUserName(this.post);
    }
    onMouseEnterUserProfile() {
        console.log("enter");
        this.popover.open();
    }
    onMouseLeaveUserProfile() {
        console.log("leave");
        this.popover.close();
    }
}