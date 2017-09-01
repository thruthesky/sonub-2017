import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../providers/app.service';
import { POST } from './../../../../providers/wordpress-api/interface';

@Component({
    selector: 'forum-view-page',
    templateUrl: 'view.html'
})

export class ForumViewPage implements OnInit {
    post: POST;
    constructor(
        private active: ActivatedRoute,
        public app: AppService
    ) {
        active.params.subscribe(params => {
            this.post = null;
            this.app.forum.postData(params['id'])
                .subscribe(post => {
                    this.post = app.forum.pre(post);
                    console.log("ForumViewPage::constructor() ==> active.params.subscribe() ==> app.forum.postData(): ", this.post);
                }, e => this.app.warning(e));
        });

    }

    ngOnInit() { }
}