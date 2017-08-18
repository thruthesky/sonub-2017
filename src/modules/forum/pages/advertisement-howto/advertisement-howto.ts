import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'advertisement-howto-page',
    templateUrl: 'advertisement-howto.html'
})
export class AdvertisementHowtoPage implements OnInit, OnDestroy {
    html = '';
    constructor(
        public app: AppService
    ) {
        app.pageLayout = 'two-column';
        app.wp.page('advertisement-howto').subscribe( html => {
            console.log("page: ", html);
            this.html = html;
        }, e => app.warning({ code: -404 }));
    }
    ngOnInit() { }
    ngOnDestroy() {
        this.app.pageLayout = 'column';
    }
}
