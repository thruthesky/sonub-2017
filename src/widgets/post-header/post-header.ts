import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AppService, POST } from './../../providers/app.service';
@Component({
    selector: 'post-header-widget',
    templateUrl: 'post-header.html'
})

export class PostHeaderWidget implements OnInit {

    @Input() post: POST;
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();

    mouse: 'in' | 'out' = 'out';
    timeout = 600;
    closingTimeout = 400;

    @ViewChild('profileDropdown') public profileDropdown: NgbDropdown;

    userName;
    constructor(
        public app: AppService
    ) { }

    ngOnInit() {
        this.userName = this.app.postUserName(this.post);
        // setTimeout(() => {
        //     this.onClickUserProfile(null);
        // }, 100);
    }

    onClickUserProfile(event: MouseEvent) {
        if ( event ) event.stopPropagation();
        this.profileDropdown.open();
    }

    onMouseEnterUserProfile(event: MouseEvent) {
        this.mouse = 'in';
        // console.log("enter, in");

        setTimeout(() => {
            if ( this.mouse == 'in' ) {
                this.profileDropdown.open();
            }
            else {
                // console.log("already out");
            }
        }, this.timeout );
    }
    
    onMouseLeaveUserProfileMenu() {
        // console.log("leave, out");
        this.mouse = 'out';
        setTimeout( () => {
            if ( this.mouse == 'out' ) this.profileDropdown.close();
        }, this.closingTimeout);
    }
}