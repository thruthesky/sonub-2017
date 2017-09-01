import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { ChatService } from './../../providers/chat.service';

@Component({
    selector: 'header-widget',
    templateUrl: 'header.html'
})

export class HeaderWidget implements OnInit {


    search: string = '';
    hasNewChat: boolean = false;
    constructor(
        public app: AppService,
        public chat: ChatService
    ) {
        chat.roomsEvent.subscribe(uid => {
            // console.log("header: event: ", uid);
            // console.log("header: me ", app.user.profile);
            // console.log("header: event: other chat user  ", chat.other );
            if ( chat.otherUid == uid ) {
                // console.log("chat.other: ", chat.other);
                this.hasNewChat = false;
            }
            else this.hasNewChat = !!uid;
            app.rerenderPage(10);
        });
    }

    ngOnInit() {
    }

    onEnterSearch() {
        this.app.share.go("search/" + this.search);
    }

}
