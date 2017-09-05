import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../providers/app.service';
import { PageScroll } from './../../../../providers/page-scroll';



@Component({
    selector: 'posts-page',
    templateUrl: 'posts.html'
})

export class PostsPage implements OnInit, OnDestroy {

    innerHTML = '';
    html = '';

    /// data
    uid: number = 0;


    /// scroll
    watch;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;

    constructor(
        active: ActivatedRoute,
        private app: AppService,
        private pageScroll: PageScroll
    ) {
        active.params.subscribe(params => {
            if (params['uid']) {
                this.uid = params['uid'];
                this.loadPage();
            }
        });
    }

    ngOnInit() {
        this.watch = this.pageScroll.watch('body', 350).subscribe(e => this.loadPage());
    }
    ngOnDestroy() {
        this.watch.unsubscribe();
    }

    loadPage() {

        if (this.noMorePosts) return;
        if (this.inLoading) return;
        else this.inLoading = true;
        this.pageNo++;

        let req = {
            uid: this.uid,
            page_no: this.pageNo
        };

        console.log("page load: ", req);

        this.app.page.load('posts', req)
            .subscribe( html => {
                console.log('html: ', html);
                this.inLoading = false;
                if ( html == 'EOF' ) {
                    console.log("no more posts:",html);
                    this.noMorePosts = true;
                    return;
                }
                this.html += html;
                this.innerHTML = this.app.share.safe( this.html );
            }, e => {
                this.inLoading = false;
            });
    }
}
