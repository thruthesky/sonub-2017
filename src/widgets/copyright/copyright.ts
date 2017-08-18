import { Component, OnInit } from '@angular/core';
import { AppService } from '../../providers/app.service';
@Component({
    selector: 'copyright-widget',
    templateUrl: 'copyright.html'
})

export class CopyrightWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}