
import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppService, POST_LIST, PAGE, PAGES } from './../../providers/app.service';
import { PageScroll } from './../../providers/page-scroll';
@Component({
    selector: 'post-list-thumbnail-text-widget',
    templateUrl: 'post-list-thumbnail-text.html'
})

export class PostListThumbnailTextWidget implements OnInit, OnDestroy, AfterViewInit {

    /// options
    @Input() slug;
    @Input() titleLength = 20;
    @Input() posts_per_page = 15;
    @Input() thumbnail = false;

    /// for page scroll
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;

    /// result pages
    pages: PAGES = [];


    constructor(
        public app: AppService,
        private pageScroll: PageScroll,
    ) {
        // console.log("PostListWidget::constructor()");
    }

    ngOnInit() {
        this.loadPage();
    }
    ngOnDestroy() {
        // console.log("PostListWidget::onDestroy()");
        this.watch.unsubscribe();
    }
    ngAfterViewInit() {
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());

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
            posts_per_page: this.posts_per_page,
            thumbnail: '160x100'
        };
        this.loadCache(req);
        this.app.forum.postList(req).subscribe((page: PAGE) => {
            // console.log('PostListThumbnailTextWidget::loadPage::', page);
            this.inLoading = false;
            if (page.paged == page.max_num_pages) {
                this.noMorePosts = true;
            }
            this.addOrReplacePage(req, page);
        }, e => this.app.warning(e));
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
    addOrReplacePage(req: POST_LIST, page: PAGE) {
        this.prepare( page );
        let i = page.paged - 1;
        if ( i < this.pages.length ) {
            // console.log("replace cached page for: ", this.app.cacheKeyPage(req));
            this.pages[i] = page;
        }
        else this.pages.push(page);
        this.app.rerenderPage();
        this.app.cacheSetPage(req, page);
    }


    prepare( page: PAGE ) {
        if ( page && page.posts && page.posts.length ) {
            for( let post of page.posts ) {
                if ( post.post_title.length < this.titleLength - 20 && post.post_content.length > 20 ) {
                    post.post_title = '<b>' + post.post_title + '</b>' + ' ▶ ' + this.app.strip_tags( post.post_content );
                }
                post.post_title = this.app.wordcut( post.post_title, this.titleLength );
            }
        }
    }

}