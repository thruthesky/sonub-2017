import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    AppService, POST_QUERY_REQUEST
} from './../../../../providers/app.service';
import {PageScroll} from './../../../../providers/page-scroll';
import {Router} from "@angular/router";
import {BUYANDSELL_PAGE, BUYANDSELL_PAGES, PAGE, POST} from "../../../../providers/wordpress-api/interface";
import {BuyAndSellViewModalService} from "../../modals/buy-and-sell-view/buy-and-sell-view.modal";


@Component({
    selector: 'buy-and-sell-list-page',
    templateUrl: 'buy-and-sell-list.html'
})

export class BuyAndSellListPage implements OnInit, OnDestroy {

    formGroup: FormGroup;

    pages: BUYANDSELL_PAGES = [];

    query = {};


    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    posts_per_page = 6;
    ///

    constructor(
                public app: AppService,
                private pageScroll: PageScroll,
                private router: Router,
                private buyAndSellModal: BuyAndSellViewModalService
    ) {

    }

    ngOnInit() {
        // this.initSearchForm();
        this.loadPage();
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());
    }

    ngOnDestroy() {
        this.watch.unsubscribe();
    }

    loadPage() {
        // console.log(`::loadPage(). noMorePosts: ${this.noMorePosts}, inLoading: ${this.inLoading}`);
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        let req: POST_QUERY_REQUEST = {
            posts_per_page: 6,
            page: this.pageNo,
            query: this.query,
            order: 'ID',
            by: 'DESC'
        };


        this.app.bns.search(req).subscribe((page: BUYANDSELL_PAGE) => {
            console.log("buyAndSellSearch", page);
            this.displayPage(page);
        }, e => {
            console.log("loadPage::e::", e);
            this.inLoading = false;
            this.noMorePosts = true;
        });
    }

    displayPage(page) {
        this.inLoading = false;
        if (page.posts.length < page.posts_per_page) this.noMorePosts = true;
        if (page.pageNo == 1) this.pages[0] = page;
        else this.pages.push(page);
    }

    urlPhoto(post) {
        let url = this.app.forum.getFirstImageThumbnailUrl(post);
        if (url) return url;
        // else return this.app.anonymousPhotoURL;
    }


    onClickShowProductView( product ) {
        console.log('Product to View::', product);
        this.buyAndSellModal.open(product).then( id => {


        }, err =>{
            console.log('Product was close', err);
            // this.app.warning(err);
        });
    }

}
