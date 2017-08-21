import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
    AppService, POST_QUERY_REQUEST
} from './../../../../providers/app.service';
import {PageScroll} from './../../../../providers/page-scroll';
import {Router} from "@angular/router";
import {BUYANDSELL_PAGE, BUYANDSELL_PAGES, PAGE, POST} from "../../../../providers/wordpress-api/interface";
import {BuyAndSellViewModalService} from "../../modals/buy-and-sell-view/buy-and-sell-view.modal";
import {PhilippineRegion} from "../../../../providers/philippine-region";


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

    provinces: Array<string> = [];
    cities = [];
    showCities: boolean = false;

    constructor(
        private fb: FormBuilder,
        public app: AppService,
        private region: PhilippineRegion,
        private pageScroll: PageScroll,
        private router: Router,
        private buyAndSellModal: BuyAndSellViewModalService
    ) {
        app.section('job');
        region.get_province(re => {
            this.provinces = re;
        }, e => {
        });
    }

    ngOnInit() {
        this.initSearchForm();
        this.loadPage();
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());
    }

    ngOnDestroy() {
        this.watch.unsubscribe();
    }

    initSearchForm() {
        this.formGroup = this.fb.group({
            tag: [''],
            priceMinimum: [0],
            priceMaximum: [null],
            city: ['all'],
            province: ['all'],
            usedItemYes: [false],
            usedItemNo: [false],
            usedItemNA: [false],
            deliverableYes: [false],
            deliverableNo: [false],
            contact: [null],
            myPost: [false]
        });
        this.formGroup.valueChanges
            .debounceTime(1000)
            .subscribe(res => this.onValueChanged(res));
    }

    resetForm() {
        this.showCities = false;
        this.formGroup.reset({
            tag: '',
            priceMinimum: 0,
            priceMaximum: null,
            city: 'all',
            province: 'all',
            usedItemYes: false,
            usedItemNo: false,
            usedItemNA: false,
            deliverableYes: false,
            deliverableNo: false,
            contact: null,
            myPost: false
        });
    }

    onValueChanged(data?: any) {
        console.log('onValueChanges::data::', data);
        let clause = [];
        this.query = {};


        // TAG, TITLE, Description
        if (data.tag) {
            clause.push(`post_title LIKE '%${data.tag}%' OR post_content LIKE '%${data.tag}%' OR varchar_3 LIKE '%${data.tag}%'` );
        }

        // price
        if ( data.priceMaximum ) {
            this.query['price'] = {
                exp: 'BETWEEN',
                value: `${data.priceMinimum} AND ${data.priceMaximum}`
            };
        }
        else {
            this.query['price'] = {
                exp: '>=',
                value: data.priceMinimum
            }
        }




        //  USED ITEM
        let usedItem = '';

        console.log('data.usedItemYes::', data.usedItemYes);
        if( data.usedItemYes ) usedItem += "char_1='y'";
        if( data.usedItemNo ) {
            usedItem ? usedItem += " OR char_1='n'" : usedItem += "char_1='n'";
        }
        if( data.usedItemNA ) {
            usedItem ? usedItem += " OR char_1='x'" : usedItem += "char_1='x'";
        }
        if( usedItem ) clause.push(usedItem);


        //  DELIVERABLE
        if (data.deliverableYes != data.deliverableNo) {
            this.query['deliverable'] = data.deliverableYes ? 'y' : 'n';
        }
        else {
            clause.push(`char_2='y' OR char_2='n'`)
        }

        if (data.myPost) this.query['post_author'] = this.app.user.id;

        // PROVINCE
        if (data.province != 'all') this.query['province'] = data.province;

        // CITY
        if (data.city != 'all') {
            if (data.province == data.city) {
                this.query['city'] = {
                    exp: 'LIKE',
                    value: `%${data.city}%`
                }
            } else this.query['city'] = data.city;
        }


        // CLAUSE
        if (clause.length) this.query['clause'] = clause;

        console.log('REQUEST ON VALUE CHANGE :::', this.query);

        this.pages = [];
        this.noMorePosts = false;
        this.pageNo = 0;
        this.loadPage();
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
        this.prepare(page);
        if (page.posts.length < page.posts_per_page) this.noMorePosts = true;
        if (page.pageNo == 1) this.pages[0] = page;
        else this.pages.push(page);
    }

    prepare(page: BUYANDSELL_PAGE) {
        if (page && page.posts && page.posts.length) {
            for (let post of page.posts) {
                if( post.usedItem == 'y' ) post['used'] = 'Yes';
                if( post.usedItem == 'n' ) post['used'] = 'No';
                if( post.usedItem == 'x' ) post['used'] = 'Not Applicable';

                if( post.deliverable == 'y' ) post['delivery'] = 'Yes';
                if( post.deliverable == 'n' ) post['delivery'] = 'No';
            }
        }
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

    onClickProvince() {
        console.log('Province::', this.formGroup.value.province);
        if (this.formGroup.value.province != 'all') {
            this.formGroup.patchValue({ city: this.formGroup.value.province });
            this.getCities();
        }
        else {
            this.formGroup.patchValue({ city: 'all' });
            this.showCities = false;
        }
    }

    getCities() {
        this.region.get_cities(this.formGroup.value.province, re => {
            if (re) {
                this.cities = re;
                this.showCities = true;
            }
        }, e => {
        });
    }

    get cityKeys() {
        return Object.keys(this.cities);
    }

}
