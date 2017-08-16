import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'list-page',
    templateUrl: 'list.html'
})
export class ForumListPage implements OnInit, AfterViewInit, OnDestroy {
    slug;
    // closeResult: string;
    constructor(
        // private active: ActivatedRoute,
        public app: AppService
    ) {
        app.section('forum');
        /// page navigated ( by clicking a menu )
        // active.params.subscribe(params => {

        //     if (params['action']) {
        //         let action = params['action'];
        //     }

        // });

    }

    ngOnInit() {

    }


    ngAfterViewInit() {


    }


    ngOnDestroy() {

    }

}
