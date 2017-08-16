import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'rules-page',
    templateUrl: 'rules.html'
})
export class RulesPage implements OnInit {
    html = '';
    constructor(
        app: AppService
    ) {
        app.wp.page('rules').subscribe( html => {
            console.log("page: ", html);
            this.html = html;
        }, e => app.warning({ code: -404 }));
    }
    ngOnInit() { }
}