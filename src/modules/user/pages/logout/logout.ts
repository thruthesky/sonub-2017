import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'logout-page',
    template: ``
})
export class LogoutPage implements OnInit {
    constructor(app: AppService) {
        app.logout();
    }

    ngOnInit() { }
}

