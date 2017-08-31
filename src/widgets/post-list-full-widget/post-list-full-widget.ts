import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../providers/app.service';
import {
    POST_LIST, POST_LIST_RESPONSE, POST, PAGE,
    COMMENT, PAGES
} from './../..//providers/wordpress-api/interface';


import { PageScroll } from './../../providers/page-scroll';

import { PostCreateEditModalService } from './../../modules/forum/modals/post-create-edit/post-create-edit.modal';

import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ForumCodeShareService } from '../../modules/forum/forum-code-share.service';


@Component({
    selector: 'post-list-full-widget',
    templateUrl: 'post-list-full-widget.html'
})
export class PostListFullWidget implements OnInit, AfterViewInit, OnDestroy {

    @Input() category;
    @Input() except;    // display posts except this post.

    ///
    slug: string = null;
    pages: PAGES = [];

    // for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    //

    // closeResult: string;
    constructor(
        public app: AppService,
        private active: ActivatedRoute,
        private pageScroll: PageScroll,
        private postCreateEditModal: PostCreateEditModalService,
        private forumShare: ForumCodeShareService
    ) {

        

        // setTimeout(() => {
        //     this.onClickPostCreate();
        // }, 500);

        /// page navigated ( by clicking a menu )
        active.params.subscribe(params => {

            if (params['slug']) { /// if a post list page navigated.
                this.slug = params['slug'];
                this.resetLoading();
                this.loadPage();
            }
            if ( params['action'] ) {
                if ( params['action'] == 'create' ) {
                    setTimeout(() => this.onClickPostCreate(), 100);
                }
            }

        });
    }

    ngOnInit() {
        /// post view page navigated ( by viewing a post )
        if (this.category) {
            /// use the post's category to show to posts of the category.
            this.slug = this.category;
            this.loadPage();
        }
    }


    ngAfterViewInit() {
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());
    }


    ngOnDestroy() {
        this.watch.unsubscribe();
    }


    resetLoading() {
        this.inLoading = false;
        this.noMorePosts = false;
        this.pageNo = 0;
        this.pages = [];
    }
    loadPage() {
        // console.log(`::loadPage(). noMorePosts: ${this.noMorePosts}, inLoading: ${this.inLoading}`);
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        let req: POST_LIST = {
            category_name: this.slug,
            paged: this.pageNo,
            posts_per_page: 5,
            thumbnail: '200x200'
        };
        this.loadCache(req);
        this.app.forum.postList(req).subscribe((page: POST_LIST_RESPONSE) => {
            console.log('Page::', page);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.app.forum.prePage( page );
            this.addOrReplacePage(req, page);
        }, err => this.app.displayError(this.app.getErrorString(err)));
    }

    

    loadCache(req: POST_LIST) {
        let p = this.app.cacheGetPage(req);
        if (p) {
            // console.log("cached for ", this.app.cacheKeyPage(req));
            this.pages.push(p);
        }
    }
    /**
     * 
     * @param req 
     * @param page 
     */
    addOrReplacePage(req: POST_LIST, page: POST_LIST_RESPONSE) {
        let i = page.paged - 1;
        if (i < this.pages.length) {
            // console.log("replace cached page for: ", this.app.cacheKeyPage(req));
            this.pages[i] = page;
        }
        else this.pages.push(page);
        this.app.cacheSetPage(req, page);
    }


    onClickPostCreate() {

        this.postCreateEditModal.open({ category: this.slug }).then(id => {
            // console.log(id);
            this.insertPost(id);
        }, err => console.error(err));

    }

    insertPost(post_ID) {
        this.app.forum.postData(post_ID).subscribe(post => {
            // console.log('this.posts:: ', this.pages);

            if (!this.pages[0].posts) {
                this.pages[0]['posts'] = [];
            }
            this.app.forum.pre( post );
            this.pages[0].posts.unshift(post);

        }, e => this.app.warning(e));
    }


}
