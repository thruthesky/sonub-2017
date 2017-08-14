import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'advertisement-howto-page',
    templateUrl: 'advertisement-howto.html'
})

export class AdvertisementHowtoPage implements OnInit, OnDestroy {
    constructor(
        public app: AppService
    ) {
        app.pageLayout = 'two-column';
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.app.pageLayout = 'column';
    }
}