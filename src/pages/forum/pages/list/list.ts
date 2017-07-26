import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../../../providers/app.service';
import { POST_LIST, POST_LIST_RESPONSE, POST, PAGE } from './../../../../providers/wordpress-api/interface';


import { PageScroll } from './../../../../providers/page-scroll';

import { PostCreateEditModalService } from './../../modals/post-create-edit/post-create-edit.modal';

import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'list-page',
    templateUrl: 'list.html'
})

export class ForumListPage implements OnInit, AfterViewInit, OnDestroy {
    slug: string = null;
    pages: Array<POST_LIST_RESPONSE> = [];

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
        private postCreateEditModal: PostCreateEditModalService
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
            posts_per_page: 1,
            thumbnail: '200x200'
        };
        this.app.forum.postList(req).subscribe(page => {
            console.log(page);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.pages.push(page);
        }, err => this.app.displayError(this.app.getErrorString(err)));
    }


    onClickPostCreate() {

        this.postCreateEditModal.open({ category: this.slug }).then(res => {
            console.log(res);
        }, err => console.error(err));

    }

    onClickPostEdit(post) {

        this.postCreateEditModal.open({ post: post }).then(res => {
            console.log(res);
        }, err => console.error(err));

    }


    onClickPostDelete(post: POST, page: PAGE) {

        if (post.post_author) {
            let re = this.app.confirm('Do you want to delete?');
            if (re) {
                this.postDelete(page, post.ID);
            }
        }
        else {
            let password = this.app.input('Input password');
            if (password) this.postDelete(page, post.ID, password);
        }
    }

    postDelete(page, ID, password?) {
        // debugger;
        this.app.forum.postDelete({ ID: ID, post_password: password }).subscribe(id => {
            console.log("file deleted: ", id);

            let index = page.posts.findIndex(post => post.ID == id);
            page.posts.splice(index, 1);

        }, err => this.app.warning(err));
    }
}