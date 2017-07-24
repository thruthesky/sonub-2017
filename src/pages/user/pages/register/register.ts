import {Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import {USER_REGISTER} from "../../../../providers/wordpress-api/interface";
import {AppService} from "../../../../providers/app.service";


@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage implements OnInit {

    userLogin: string = '';
    userPass: string = '';
    userEmail: string = '';


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

        if( !this.userLogin && this.userLogin.length ==  0 ) return this.errorMessage = '*Username is required';
        if( !this.userPass && this.userPass.length ==  0 ) return this.errorMessage = '*Password is required';
        if( !this.userEmail && this.userEmail.length ==  0 ) return this.errorMessage = '*Email is required';

        let data: USER_REGISTER = {
            user_login: this.userLogin,
            user_pass: this.userPass,
            user_email: this.userEmail
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
