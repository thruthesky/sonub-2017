import {Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import {USER_REGISTER} from "../../../../providers/wordpress-api/interface";
import {AppService} from "../../../../providers/app.service";


@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage implements OnInit {

    user_login: string = '';
    user_pass: string = '';
    user_email: string = '';


    errorMessage: string = null;
    constructor(
        private app: AppService,
        private router: Router
    ) {
    }

    ngOnInit() {
    }



    onClickUserRegister() {
        console.log('onClickUserRegister::');
        this.errorMessage = null;

        if( !this.user_login && this.user_login.length ==  0 ) return this.errorMessage = '*Username is required';
        if( !this.user_pass && this.user_pass.length ==  0 ) return this.errorMessage = '*Password is required';
        if( !this.user_email && this.user_email.length ==  0 ) return this.errorMessage = '*Email is required';

        let data: USER_REGISTER = {
            user_login: this.user_login,
            user_pass: this.user_pass,
            user_email: this.user_email
        };
        this.app.user.register( data ).subscribe(res => {
            console.log('app.user.register::res', res);
            if( res.session_id ) {
                alert( 'Registration Success' );
                this.router.navigateByUrl("/");
            }
        }, error => {
            console.log('app.user.register::error', error);
            alert( error.code );
            this.errorMessage = error.code
        });


    }
}
