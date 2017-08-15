import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    AppService, JOB, JOBS, JOB_PAGE, JOB_PAGES, JOB_LIST_REQUEST
} from './../../../../providers/app.service';
import { PhilippineRegion } from "../../../../providers/philippine-region";


@Component({
    selector: 'job-list-page',
    templateUrl: 'job-list.html'
})

export class JobListPage implements OnInit {

    formGroup: FormGroup;

    pages: JOB_PAGES = [];


    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    posts_per_page = 6;

    urlDefault: string = "assets/img/anonymous.png";
    urlPhoto: string = this.urlDefault;



    /** Work Experience Variable*/
    numbers = Array.from(new Array(20), (x, i) => i + 1);

    /** Min and Max Age Variables*/
    minAge: number = 18;
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
    ) {
        region.get_province(re => {
            this.provinces = re;
        }, e => {
            this.app.displayError('Unable to get Province data' + e)
        });

        
        this.app.job.search({
            gender: 'M',
            birthday: {
                exp: 'BETWEEN',
                value: '19500101 AND 20800101'
            },
            fullname: {
                exp: 'LIKE',
                value: '%jae%'
            },
            clause: [
                `(ID > 100 AND char_1='M') OR (ID < 99999 AND char_1='F')`,
                `post_type = 'post' OR post_type = 'attachment'`
            ]
        }).subscribe(res => {
            console.log("job search", res);
        }, e => this.app.warning(e));

    }


    ngOnInit() {
        this.initSearchForm();
        this.loadPage();
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

    loadPage() {
        // console.log(`::loadPage(). noMorePosts: ${this.noMorePosts}, inLoading: ${this.inLoading}`);
        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        this.loadCache(this.request);
        this.app.job.list(this.request).subscribe((page: JOB_PAGE) => {
            console.log('Job Page::', page);
            // this.app.title(page.category_name);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.addOrReplacePage(this.request, page);
        }, e => this.app.warning(e));
    }


    onValueChanged(data?: any) {
        console.log('onValueChanges::data::', data);

        // city:"all"
        // experience:"all"
        // female:false
        // male:true
        // maxAge:60
        // minAge:18
        // name:null
        // profession:"all"
        // province:"all"

        let clause = [];

        let req = {};

        // GENDER
        if( data.male != data.female ) {
            req['gender'] = {
                exp: '=',
                value: data.male ? 'm' : 'f'
            }
        }
        else {
            clause.push(`char_1='m' OR char_1='f'`)
        }

        // BIRTHDAY
        let min = (this.currentYear - data.minAge + 1) + '0101'; console.log('min::', min);
        let max = (this.currentYear - data.maxAge) + '0101'; console.log('max::', max);
        req['birthday'] = {
            exp: 'BETWEEN',
            value: `${max} AND ${min}`
        };

        // PROFESSION
        if ( data.profession != 'all') {
            req['profession'] = {
                exp: '=',
                value: data.profession
            }
        }

        // PROVINCE
        if ( data.province != 'all') {
            req['province'] = {
                exp: '=',
                value: data.province
            }
        }

        // CITY
        if ( data.city != 'all' ) {
            req['city'] = {
                exp: '=',
                value: data.city
            }
        }





        if ( data.name ) {
            req['fullname'] = {
                exp: 'LIKE',
                value: `%${data.name}%`
            }
        }


        // CLAUSE
        if ( clause.length ) {
            req['clause'] = clause;
        }

        console.log('REQUEST ON VALUE CHANGE :::', req);





        // this.app.job.search({
        // gender: {
        //     exp: '=',
        //     value: 'M'
        // },
        // birthday: {
        //     exp: 'BETWEEN',
        //     value: '19500101 AND 20010101'
        // },
        // fullname: {
        //     exp: 'LIKE',
        //     value: '%jae%'
        // },
        //     clause: [
        //         `(ID < 99999 AND char_1='F')`,
        //         `post_type = 'post' OR post_type = 'attachment'`
        //     ]
        // }).subscribe(res => {
        //     console.log("job search", res);
        // }, e => this.app.warning(e));

    }


    loadCache(req: JOB_LIST_REQUEST) {
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
    addOrReplacePage(req: JOB_LIST_REQUEST, page: JOB_PAGE) {
        this.prepare(page);
        let i = page.paged - 1;
        if (i < this.pages.length) {
            // console.log("replace cached page for: ", this.app.cacheKeyPage(req));
            this.pages[i] = page;


        }
        else this.pages.push(page);
        this.app.cacheSetPage(req, page);
    }


    prepare(page: JOB_PAGE) {
        if (page && page.posts && page.posts.length) {
            for (let post of page.posts) {
                // prepare
            }
        }
    }

    get request(): JOB_LIST_REQUEST {
        return {
            category_name: 'jobs',
            paged: this.pageNo,
            posts_per_page: this.posts_per_page,
            thumbnail: '160x100'
        };
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



    onClickShowMyPost() { }


    onClickProfession() {
        console.log('SearchByProfession');
    }

    onClickLocation() {
        console.log('SearchByLocation');
    }

    onClickMore() {
        console.log('showMore Option')
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



}
