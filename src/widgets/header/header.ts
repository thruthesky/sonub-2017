import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'header-widget',
    templateUrl: 'header.html'
})

export class HeaderWidget implements OnInit {
    hasNewChat: number = 0;
    constructor(
        public app: AppService
    ) {
        app.chatRoomEvent.subscribe(uid => {
            console.log("header: event: ", uid);
            // console.log("header: me ", app.user.profile);
            console.log("header: event: other chat user xapi uid ", app.chatOtherXapiUid, app.chatUser );
            if ( app.chatOtherXapiUid == uid ) {
                console.log("app.chatUser: ", app.chatUser);
                this.hasNewChat = 0;
            }
            else this.hasNewChat = uid;
            app.rerenderPage(10);
        });
    }

    ngOnInit() { }
}