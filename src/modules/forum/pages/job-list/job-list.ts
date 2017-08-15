import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    AppService, JOB, JOBS, POST_QUERY_REQUEST, JOB_PAGE, JOB_PAGES, POST_QUERY_RESPONSE
} from './../../../../providers/app.service';
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { PageScroll } from './../../../../providers/page-scroll';


@Component({
    selector: 'job-list-page',
    templateUrl: 'job-list.html'
})

export class JobListPage implements OnInit, OnDestroy {

    formGroup: FormGroup;

    pages: JOB_PAGES = [];

    query: {};

    searchBy: { location?, profession?, more? } = {};


    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    posts_per_page = 6;
    ///





    /** Work Experience Variable*/
    numbers = Array.from(new Array(20), (x, i) => i + 1);

    /** Min and Max Age Variables*/
    minAge: number = 14;
    maxAge: number = 60;
    minAgeRange = Array.from(new Array(this.maxAge - this.minAge), (x, i) => i + 1);
    maxAgeRange = this.minAgeRange;
    betweenAge: number = this.minAge - 1;

    provinces: Array<string> = [];
    cities = [];
    showCities: boolean = false;

    today = new Date();
    currentYear = this.today.getFullYear();

    constructor(
        private fb: FormBuilder,
        public app: AppService,
        private region: PhilippineRegion,
        private pageScroll: PageScroll
    ) {
        region.get_province(re => {
            this.provinces = re;
        }, e => {
            this.app.displayError('Unable to get Province data' + e)
        });


// let req: POST_QUERY_REQUEST = {
//     page: 3,
//     posts_per_page: 2,
//     query: {
//         slug: 'jobs',
//         gender: 'M',
//         birthday: {
//             exp: 'BETWEEN',
//             value: '19500101 AND 20800101'
//         },
//         fullname: {
//             exp: 'LIKE',
//             value: '%jae%'
//         },
//         clause: [
//             `(ID > 100 AND char_1='M') OR (ID < 99999 AND char_1='F')`,
//             `post_type = 'post' OR post_type = 'attachment'`
//         ]
//     },
//     order: 'ID',
//     by: 'DESC'
// };
// this.app.job.search(req).subscribe((page: JOB_PAGE) => {
//     console.log("job search", page);
// }, e => this.app.warning(e));
    }



    ngOnInit() {
        this.initSearchForm();
        this.loadPage();
        this.watch = this.pageScroll.watch( 'body', 350 ).subscribe( e => this.loadPage() );
    }

    ngOnDestroy() {
        this.watch.unsubscribe();
    }
    initSearchForm() {
        this.formGroup = this.fb.group({
            male: [false],
            female: [false],
            experience: ['all'],
            profession: ['all'],
            province: ['all'],
            city: ['all'],
            minAge: [this.minAge],
            maxAge: [this.maxAge],
            name: ['']
        });
        this.formGroup.valueChanges
            .debounceTime(1000)
            .subscribe(res => this.onValueChanged(res));
    }


    resetForm(){
        this.showCities = false;
        this.formGroup.reset({
            male: false,
            female: false,
            experience: 'all',
            profession: 'all',
            province: 'all',
            city: 'all',
            minAge: this.minAge,
            maxAge: this.maxAge,
            name: ''
        });
    }

    loadPage() {
        // console.log(`::loadPage(). noMorePosts: ${this.noMorePosts}, inLoading: ${this.inLoading}`);
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        let req: POST_QUERY_REQUEST = {
            posts_per_page: 2,
            page: this.pageNo,
            query: this.query,
            // order: 'ID',
            // by: 'DESC'
        };


        this.app.job.search(req).subscribe((page: JOB_PAGE) => {
            console.log("jobSearch", page);
            this.displayPage( page );
        }, e => {
            console.log("loadPage::e::", e);
            this.inLoading = false;
            this.noMorePosts = true;
        });
    }

    displayPage( page ) {
        this.inLoading = false;
        if ( page.posts.length < page.posts_per_page ) this.noMorePosts = true;
        if ( page.pageNo == 1 ) this.pages[0] = page;
        else this.pages.push( page );
    }


    onValueChanged(data?: any) {
        console.log('onValueChanges::data::', data);
        let clause = [];
        this.query = {};


        if (this.searchBy.more == true ) {
            // GENDER
            if (data.male != data.female) {
                this.query['gender'] = data.male ? 'm' : 'f';
            }
            else {
                clause.push(`char_1='m' OR char_1='f'`)
            }


            // FULL NAME
            if (data.name) {
                this.query['fullname'] = {
                    exp: 'LIKE',
                    value: `%${data.name}%`
                }
            }

            // Experience
            if (data.experience != 'all') {
                this.query['experience'] = {
                    exp: '>=',
                    value: data.experience
                }
            }

            // BIRTHDAY
            let min = (this.currentYear - data.minAge + 1) + '0000'; console.log('min::', min);
            let max = (this.currentYear - data.maxAge) + '0000'; console.log('max::', max);
            this.query['birthday'] = {
                exp: 'BETWEEN',
                value: `${max} AND ${min}`
            };

        }


        if( this.searchBy.profession == true ){
            // PROFESSION
            if (data.profession != 'all') this.query['profession'] = data.profession;
        }

        if (this.searchBy.location == true ) {
            // PROVINCE
            if (data.province != 'all') this.query['province'] = data.province;

            // CITY
            if (data.city != 'all') this.query['city'] = data.city;
        }


        // CLAUSE
        if (clause.length) this.query['clause'] = clause;

        console.log('REQUEST ON VALUE CHANGE :::', this.query);
        this.pages = [];
        this.noMorePosts = false;
        this.pageNo = 0;
        this.loadPage();
    }


    // loadCache(req: JOB_LIST_REQUEST) {
    //     let p = this.app.cacheGetPage(req);
    //     if (p) {
    //         // console.log("cached for ", this.app.cacheKeyPage(req));
    //         this.jobs.push(p);
    //     }
    // }


    // /**
    //  *
    //  * @param req
    //  * @param page
    //  */
    // addOrReplacePage(req: JOB_LIST_REQUEST, page: JOB_PAGE) {
    //     this.prepare(page);
    //     let i = page.paged - 1;
    //     if (i < this.pages.length) {
    //         // console.log("replace cached page for: ", this.app.cacheKeyPage(req));
    //         this.pages[i] = page;


    //     }
    //     else this.pages.push(page);
    //     this.app.cacheSetPage(req, page);
    // }


    // prepare(page: JOB_PAGE) {
    //     if (page && page.posts && page.posts.length) {
    //         for (let post of page.posts) {
    //             // prepare
    //         }
    //     }
    // }

    // get request(): JOB_LIST_REQUEST {
    //     return {
    //         category_name: 'jobs',
    //         paged: this.pageNo,
    //         posts_per_page: this.posts_per_page,
    //         thumbnail: '160x100'
    //     };
    // }


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



    onClickShowMyPost() { }


    onClickProfession() {
        console.log('SearchByProfession');
        this.searchBy = (!this.searchBy.profession || this.searchBy.more ) ? {profession: true} : {};
        this.resetForm();
    }

    onClickLocation() {
        console.log('SearchByLocation');
        this.searchBy = (!this.searchBy.location || this.searchBy.more ) ? {location: true} : {};
        this.resetForm();
    }

    onClickMore() {
        console.log('showMore Option');
        this.searchBy = (!this.searchBy.more) ? this.searchBy = { profession: true, more: true, location: true } : {};
    }

    minRangeChange() {
        this.betweenAge = this.formGroup.value.minAge - 1;
        this.maxAgeRange = this.getRange(this.formGroup.value.minAge, this.maxAge);
    }
    maxRangeChange() {
        this.minAgeRange = this.getRange(this.minAge, this.formGroup.value.maxAge);
    }
    getRange(min, max) {
        return Array.from(new Array(max - min), (x, i) => i + 1);
    }



    urlPhoto(post) {
        let url = this.app.forum.getFirstImageThumbnailUrl(post);
        if (url) return url;
        else return this.app.anonymousPhotoURL;
    }

}
