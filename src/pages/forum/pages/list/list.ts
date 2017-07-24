import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../../../providers/app.service';
import { POST_LIST, POST_LIST_RESPONSE } from './../../../../providers/wordpress-api/interface';


import { PageScroll } from './../../../../providers/page-scroll';

import { PostCreateModalService } from './../../modals/post-create.modal';

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
        private postCreateModal: PostCreateModalService
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

        // this.watch = this.pageScroll.watch('body').subscribe(e => {
        //     if (this.inLoading) {
        //         console.log("Page is in loading...");
        //         return;
        //     }
        //     this.inLoading = true;
        //     this.pageNo++;
        //     console.log("Going to load Page No. ", this.pageNo);
        //     setTimeout(() => { this.inLoading = false; console.log(`Page No. ${this.pageNo} loaded!`); }, 3000);
        // });


    }


    ngOnDestroy() {
        this.watch.unsubscribe();
    }


    loadPage() {
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        this.app.forum.postList({ category_name: this.slug, paged: this.pageNo }).subscribe(page => {
            console.log(page);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.pages.push(page);
        }, err => this.app.displayError(this.app.getErrorString(err)));
    }


    onClickPost() {

        // this.postCreateModal.open().result.then((result) => {
        //     console.log( `Closed with: ${result}` );
        // }, (reason) => {
        //     console.log(`Dismissed ${reason}`);
        // });


        this.postCreateModal.open().then(res => {
            console.log(res);
        }, err => console.error(err));

    }


}