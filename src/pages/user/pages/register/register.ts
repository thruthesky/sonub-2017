import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {USER_REGISTER} from "../../../../providers/wordpress-api/interface";
import {AppService} from "../../../../providers/app.service";

export interface _DATE {
    year: number;
    month: number;
    day: number;
}

@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage implements OnInit {

    user_login: string = '';
    user_pass: string = '';
    user_email: string = '';
    name: string = '';
    mobile: string = '';
    gender: string = '';
    address: string = '';
    birthday: _DATE;
    landline: string = '';


    errorMessage: string = null;
    loading: boolean = false;

    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    now = (new Date());

    constructor(private app: AppService,
                private router: Router) {
    }

    ngOnInit() {

        this.birthday = {
            year: this.now.getFullYear(),
            month: this.now.getMonth()+1,
            day: this.now.getDate()
        };
    }


    onClickUserRegister() {
        console.log('onClickUserRegister::');
        this.errorMessage = null;

        if (!this.user_login && this.user_login.length == 0) return this.errorMessage = '*Username is required';
        if (!this.user_pass && this.user_pass.length == 0) return this.errorMessage = '*Password is required';
        if (!this.user_email && this.user_email.length == 0) return this.errorMessage = '*Email is required';
        this.loading = true;

        let data: USER_REGISTER = {
            user_login: this.user_login,
            user_pass: this.user_pass,
            user_email: this.user_email,
            name: this.name,
            mobile: this.mobile,
            gender: this.gender,
            address: this.address,
            birthday: this.birthday.year + this.add0(this.birthday.month) + this.add0(this.birthday.day),
            landline: this.landline
        };
        this.app.user.register(data).subscribe(res => {
            console.log('app.user.register::res', res);
            if (res.session_id) {
                alert('Registration Success');
                this.router.navigateByUrl("/");
            }
            this.loading = false;
        }, error => {
            console.log('app.user.register::error', error);
            this.loading = false;
            this.app.warning( error );
            this.errorMessage = error.code
        });
    }

    add0(n:number): string {
        return n < 10 ? '0' + n : n.toString();
    }

    onChangeBirthday(){
        console.log(this.birthday);
    }
}
