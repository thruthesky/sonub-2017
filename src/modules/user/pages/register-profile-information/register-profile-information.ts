import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { FILES, USER_UPDATE, USER_UPDATE_RESPONSE } from "../../../../providers/wordpress-api/interface";
import { AppService } from "../../../../providers/app.service";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { DATEPICKER } from "../../../../etc/interface";

@Component({
    selector: 'register-profile-information-page',
    templateUrl: 'register-profile-information.html'
})

export class RegisterProfileInformationPage {

    name: string = '';
    mobile: string = '';
    gender: string = 'm';
    birthday: DATEPICKER;

    files: FILES = [];


    errorMessage: string = null;
    loading: boolean = false;

    today = (new Date());

    constructor(
        public app: AppService,
                private router: Router,
                dateConfig: NgbDatepickerConfig
    ) {
        app.section('user');
        dateConfig.minDate = {year: 1956, month: 1, day: 1};
        dateConfig.maxDate = {year: this.today.getFullYear(), month: 12, day: 31};

        this.birthday = {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate()
        };
    }

    onSubmitUpdateUserInfo() {
        this.errorMessage = null;
        this.loading = true;
        let data: USER_UPDATE = {
            user_email: this.app.user.email,
            name: this.name,
            display_name: this.name,
            mobile: this.mobile,
            gender: this.gender,
            birthday: this.birthday.year + this.app.add0(this.birthday.month) + this.app.add0(this.birthday.day)
        };
        this.app.user.update(data).subscribe( (res: USER_UPDATE_RESPONSE) => {
            // console.log('updateUserInfo:', res);
            let userData = {
                name: data['name']
            };
            this.app.userUpdate( userData, () => {
                this.loading = false;
                this.router.navigateByUrl('/');
            });
        }, err => {
            this.loading = false;
            this.errorMessage = err.code;
        });
    }


}
