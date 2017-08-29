import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';

import {Subject} from "rxjs/Subject";
import {PAGES} from "../../providers/wordpress-api/interface";

import { ChatService } from './../../providers/chat.service';
@Component({
    selector: 'header-widget',
    templateUrl: 'header.html'
})

export class HeaderWidget implements OnInit {


    pages: PAGES = [];

    categorySearch: Array<string> = ['jobs','buyandsell'];
    search: string = '';

    typing = new Subject<string>();

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
                // console.log("app.chatUser: ", chat.other);
                this.hasNewChat = false;
            }
            else this.hasNewChat = !!uid;
            app.rerenderPage(10);
        });
    }

    ngOnInit() {
        this.typing
            .debounceTime(500)
            .subscribe(() => {
                console.log('do::Search::', this.search)
                this.showSearchResult();
            });
    }

    onKeyUpStartSearch() {
        this.typing.next();
    }

    showSearchResult() {
        let req = [
            {
                posts_per_page: 5,
                page: 1,
                query: {
                    slug: 'buyandsell'
                },
                clause: [
                    `post_title LIKE '%${this.search}%' OR post_content LIKE '%${this.search}%' OR varchar_3 LIKE '%${this.search}%'`
                ],
                order: 'ID',
                by: 'DESC'
            },
            {
                posts_per_page: 5,
                page: 1,
                query: {
                    slug: 'jobs'
                },
                clause: [
                    `post_title LIKE '%${this.search}%' OR post_content LIKE '%${this.search}%' OR varchar_4 LIKE '%${this.search}%'`
                ],
                order: 'ID',
                by: 'DESC'
            }
        ];
        this.pages = this.app.search.data(req);
        console.log('pages', this.pages);
    }
}
