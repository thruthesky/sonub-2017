import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { TestService } from './../../providers/test.service';




@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})

export class HomePage implements OnInit {
    constructor(
        private app: AppService,
        // private test: TestService
    ) {
    }

    ngOnInit() { }





}