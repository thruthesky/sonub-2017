
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService, POST, POSTS, POST_LIST, PAGE } from './../../providers/app.service';


import { PostCreateEditModalService } from './../../modules/forum/modals/post-create-edit/post-create-edit.modal';



@Component({
    selector: 'post-latest-widget',
    templateUrl: 'post-latest.html'
})

export class PostLatestWidget implements OnInit, AfterViewInit {


    @Input() category;
    @Input() title;
    @Input() titleCreate;
    page: PAGE;
    titleLength = 58;
    constructor(
        public app: AppService,
        private postCreateEditModal: PostCreateEditModalService
    ) {

    }

    ngOnInit() {
    }
    ngAfterViewInit() {
        setTimeout(() => this.loadPosts(), 100);
    }


    loadPosts() {

        let req: POST_LIST = {
            category_name: this.category,
            paged: 1,
            posts_per_page: 5,
            thumbnail: '32x32'
        };
        // console.log('latest: ', req);
        this.page = this.app.cacheGetPage(req);
        // console.log("cached: ", this.news);
        this.app.forum.postList(req).subscribe((page: PAGE) => {
            // console.log('Page::', page);
            this.prepare(page);
            this.app.cacheSetPage(req, page);
            this.page = page;
        }, e => this.app.warning(e));


    }


    prepare( page: PAGE ) {
        if ( page && page.posts && page.posts.length ) {
            for( let post of page.posts ) {
                // post = this.app.forum.pre( post );

                if ( post.post_title.length < this.titleLength - 20 && post.post_content.length > 20 ) {
                    post.post_content = this.app.strip_tags( post.post_content );
                    post.post_title += ' ▶ ' + post.post_content.substr(0, 100);
                }
                // post.post_title = post.post_title.substring( 0, this.titleLength );
                post.post_title = this.app.wordcut( post.post_title, this.titleLength );
                
            }
        }
    }



    onClickCreate() {

        if (!this.app.user.isLogin) {
            this.app.alert.notice('login', 'login_first');
            return;
        }

        this.postCreateEditModal.open({ category: this.category }).then(id => {
            this.loadPosts();
        }, err => console.error(err));
    }

}