import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'list-page',
    templateUrl: 'list.html'
})
export class ForumListPage implements OnInit, AfterViewInit, OnDestroy {
    slug;
    // closeResult: string;
    constructor(
        public app: AppService
    ) {
        app.section('forum');
    }

    ngOnInit() {

    }


    ngAfterViewInit() {
        

    }


    ngOnDestroy() {
        
    }

}
