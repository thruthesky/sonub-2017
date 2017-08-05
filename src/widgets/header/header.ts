import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'header-widget',
    templateUrl: 'header.html'
})

export class HeaderWidget implements OnInit {
    @Input() title;
    showPanelMenu: boolean = false;
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}