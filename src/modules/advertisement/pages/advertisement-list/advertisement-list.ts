import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService, POSTS } from '../../../../providers/app.service';

@Component({
    selector: 'advertisement-list-page',
    templateUrl: 'advertisement-list.html'
})

export class AdvertisementListPage implements OnInit, OnDestroy {
    posts: POSTS;
    loginWarning;
    constructor(
        public app: AppService
    ) {
        if ( app.user.isLogout ) this.loadLoginWarning();
        else this.loadMyAdvertisements();
    }


    ngOnInit() { }
    ngOnDestroy() { }
    loadLoginWarning() {
        this.app.page.cache('advertisement-login-warning', {}, re => {
                console.log('adver login warning: ', re);
                this.loginWarning = re;
            });
    }
    loadMyAdvertisements() {
        this.app.wp.post({
            route: 'wordpress.get_my_advertisements',
            session_id: this.app.user.sessionId
        })
        .subscribe( (posts: POSTS) => {
            console.log("My ads: ", posts);
            this.posts = posts;
        }, e => this.app.warning(e));
    }
}