import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../../../providers/app.service';
import {
    POST_LIST, POST_LIST_RESPONSE, POST, PAGE,
    COMMENT, PAGES
} from './../../../../providers/wordpress-api/interface';


import { PageScroll } from './../../../../providers/page-scroll';

import { PostCreateEditModalService } from './../../modals/post-create-edit/post-create-edit.modal';

import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ForumCodeShareService } from './../../forum-code-share.service';


@Component({
    selector: 'list-page',
    templateUrl: 'list.html'
})

export class ForumListPage implements OnInit, AfterViewInit, OnDestroy {
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


        active.params.subscribe(params => {
            this.slug = params['slug'];
            this.loadPage();
        });
    }

    ngOnInit() {

    }


    ngAfterViewInit() {
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());

        // setTimeout( () => this.onClickPostCreate(), 0);


    }


    ngOnDestroy() {
        this.watch.unsubscribe();
    }


    loadPage() {
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        let req: POST_LIST = {
            category_name: this.slug,
            paged: this.pageNo,
            posts_per_page: 20,
            thumbnail: '200x200'
        };
        this.app.forum.postList(req).subscribe(page => {
            console.log('Page::', page);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.pages.push(page);
        }, err => this.app.displayError(this.app.getErrorString(err)));
    }


    onClickPostCreate() {

        this.postCreateEditModal.open({ category: this.slug }).then(id => {
            // console.log(id);
            this.insertPost(id);
        }, err => console.error(err));

    }

    onClickPostEdit(post) {

        this.postCreateEditModal.open({ post: post }).then(id => {
            console.log(id);
            this.forumShare.updatePost( post );
        }, err => console.error(err));

    }


    onClickPostDelete(post: POST, page: PAGE) {

        if (post.post_author) {
            this.app.confirm(this.app.text('confirmDelete')).then(code => {
                if (code == 'yes') this.postDelete(page, post.ID);
            });
        }
        else {
            let password = this.app.input('Input password');
            if (password) this.postDelete(page, post.ID, password);
        }
    }

    postDelete(page, ID, password?) {
        // debugger;
        this.app.forum.postDelete({ ID: ID, post_password: password }).subscribe(res => {
            console.log("file deleted: ", res);

            let index = page.posts.findIndex(post => post.ID == res.ID);
            if (res.mode == 'delete') {
                page.posts.splice(index, 1);
            }
            else this.forumShare.updatePost( page.posts[index] );


        }, err => this.app.warning(err));
    }

    onCommentCreate(comment_ID, post: POST) {
        console.log(`ForumListPage::onCommentCreate()  : ${comment_ID}`);
    }

    insertPost(post_ID) {
        this.app.forum.postData(post_ID).subscribe(post => {
            console.log('this.posts:: ', this.pages);

            if( ! this.pages[0].posts ) {
                this.pages[0]['posts'] = [];
            }
            this.pages[0].posts.unshift(post);

        }, e => this.app.warning(e));
    }




}
