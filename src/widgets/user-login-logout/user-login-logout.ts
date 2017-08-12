import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'user-login-logout-widget',
    templateUrl: 'user-login-logout.html'
})

export class UserLoginLogoutWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}