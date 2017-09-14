import {Component} from '@angular/core';


import { AppService } from './../../../../providers/app.service';
import {
    USER_CHANGE_PASSWORD
} from './../../../../providers/wordpress-api/interface';
import {Router} from "@angular/router";

@Component({
    selector: 'change-password-page',
    templateUrl: 'change-password.html'
})

export class ChangePasswordPage {

    new_password: string = null;
    old_password: string = null;

    errorMessage: string = null;
    loading: boolean = false;

    text: any = {};

    constructor(public app: AppService,
                private router: Router) {
        app.section('user');


        let codes = [
            'user_change_password',
            'user_change_password_desc',
        ];
        app.wp.text(codes, re => this.text = re);
    }

    onSubmitChangePassword() {
        console.log('onSubmitChangePassword');
        this.errorMessage = '';
        this.loading = false;
        if (!this.old_password) return this.errorMessage = '*Old Password is Required!';
        if (!this.new_password) return this.errorMessage = '*New Password is Required!';
        this.loading = true;

        let data: USER_CHANGE_PASSWORD = {
            old_password: this.old_password,
            new_password: this.new_password
        };
        this.app.user.changePassword(data).subscribe(res => {
            console.log('changePassword::res', res);
            this.loading = false;
            this.app.confirm(this.app.text('changePassword')).then(() => {
                this.router.navigateByUrl('/profile');
            });

        }, err => {
            this.app.warning(err);
            this.loading = false;
        });
    }
}
