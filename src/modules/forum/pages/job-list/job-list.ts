import { Component, OnInit } from '@angular/core';
import {
    AppService, JOB, JOBS, JOB_PAGE, JOB_PAGES, JOB_LIST_REQUEST
} from './../../../../providers/app.service';


@Component({
    selector: 'job-list-page',
    templateUrl: 'job-list.html'
})

export class JobListPage implements OnInit {
    pages: JOB_PAGES = [];


    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    posts_per_page = 6;

    urlDefault: string = "assets/img/anonymous.png";
    urlPhoto: string = this.urlDefault;

    constructor(
        public app: AppService
    ) { }


    ngOnInit() {
        this.loadPage();
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


}
