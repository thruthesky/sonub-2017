import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    AppService, POST_QUERY_REQUEST, JOB_PAGE, JOB_PAGES
} from './../../../../providers/app.service';
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { PageScroll } from './../../../../providers/page-scroll';
import { Router } from "@angular/router";
import {JOB, PAGE, POST} from "../../../../providers/wordpress-api/interface";


@Component({
    selector: 'job-list-page',
    templateUrl: 'job-list.html'
})

export class JobListPage implements OnInit, OnDestroy {

    formGroup: FormGroup;

    pages: JOB_PAGES = [];
    page: JOB_PAGE;

    profile: JOB;

    query = {};

    searchForm: boolean = false;
    jobProfession: string = 'all';



    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    posts_per_page = 10;
    ///


    /** Work Experience Variable*/
    numbers = Array.from(new Array(20), (x, i) => i + 1);

    /** Min and Max Age Variables*/
    minAge: number = 14;
    maxAge: number = 70;
    minAgeRange = Array.from(new Array(this.maxAge - this.minAge), (x, i) => i + 1);
    maxAgeRange = this.minAgeRange;
    betweenAge: number = this.minAge - 1;

    provinces: Array<string> = [];
    cities = [];
    showCities: boolean = false;

    today = new Date();
    currentYear = this.today.getFullYear();

    activeView: boolean = false;

    text: any = {};
    constructor(
        private fb: FormBuilder,
        public app: AppService,
        private region: PhilippineRegion,
        private pageScroll: PageScroll,
        private router: Router
    ) {
        app.section('job');
        region.get_province(re => {
            this.provinces = re;
        }, () => {
        });

        let codes = [
            'job_desc', 'total', 'look_for'
        ];
        app.wp.text(codes, re => this.text = re);


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


    resetForm() {
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
            posts_per_page: this.posts_per_page,
            page: this.pageNo,
            query: this.query,
            order: 'ID',
            by: 'DESC'
        };


        this.app.job.search(req).subscribe((page: JOB_PAGE) => {
            // console.log("jobSearch", page);
            this.displayPage(page);
        }, e => {
            // console.log("loadPage::e::", e);
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


    onValueChanged(data?: any) {
        // console.log('onValueChanges::data::', data);
        let clause = [];
        this.query = {};


        // GENDER
        if (data.male != data.female) this.query['gender'] = data.male ? 'm' : 'f';

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
        let min = (this.currentYear - data.minAge + 1) + '0000';
        console.log('min::', min);
        let max = (this.currentYear - data.maxAge) + '0000';
        console.log('max::', max);
        this.query['birthday'] = {
            exp: 'BETWEEN',
            value: `${max} AND ${min}`
        };

        // PROFESSION
        if (data.profession != 'all') this.query['profession'] = data.profession;


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

        // console.log('REQUEST ON VALUE CHANGE :::', this.query);

        this.pages = [];
        this.noMorePosts = false;
        this.pageNo = 0;
        this.loadPage();
    }

    onClickProvince() {
        // console.log('Province::', this.formGroup.value.province);
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
        }, () => {});
    }

    get cityKeys() {
        return Object.keys(this.cities);
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

    getAge(birthday) {
        if (birthday && birthday.length > 4) {
            let year = parseInt(birthday.substring(0, 4));
            return this.currentYear - year;
        }
    }


    urlPhoto(post) {
        let url = this.app.forum.getFirstImageThumbnailUrl(post);
        if (url) return url;
        else return this.app.anonymousPhotoURL;
    }

    onClickEdit() {
        this.router.navigate(['/job/edit/', this.profile.ID]);
    }


    onClickDelete() {
        if (this.profile.author.ID) {
            this.app.confirm(this.app.text('confirmDelete')).then(code => {
                if (code == 'yes') this.postDelete(this.profile.ID);
            }, () => {});
        }
        else {
            let password = this.app.input('Input password');
            if (password) this.postDelete(this.profile.ID, password);
        }
    }

    postDelete(ID, password?) {
        // debugger;
        this.app.forum.postDelete({ ID: ID, post_password: password }).subscribe(res => {
            console.log("file deleted: ", res);

            let index = this.page.posts.findIndex(post => post.ID == res.ID);
            if (res.mode == 'delete') {
                this.page.posts.splice(index, 1);
                this.activeView = false;
            }
        }, err => this.app.warning(err));
    }


    showSearchForm() {
        this.searchForm = true;
        this.formGroup.patchValue({ profession: this.jobProfession });
    }

    hideSearchForm() {
        this.searchForm = false;
        this.jobProfession = 'all';
        this.resetForm();
    }

    onClickShowDetail(job, page) {
            this.activeView  = true;
            this.profile = job;
            this.page = page;
            history.pushState('','', `/job/view/${job.ID}`);
            setTimeout( () => this.app.scrollToY(0));
    }
    onClickShowList(){
        this.activeView = false;
        history.pushState('','', '/job'  );
        setTimeout( () => this.app.scrollTo( 'job'+this.profile.ID, '#job'+this.profile.ID ));
    }

}
