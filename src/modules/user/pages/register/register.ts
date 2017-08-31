import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FILES, USER_REGISTER, USER_UPDATE, USER_UPDATE_RESPONSE } from "../../../../providers/wordpress-api/interface";
import { AppService } from "../../../../providers/app.service";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { Base } from './../../../../etc/base';
import { DATEPICKER } from "../../../../etc/interface";

@Component({
    selector: 'register-page',
    templateUrl: 'register.html'
})

export class RegisterPage extends Base implements OnInit {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;
    activeForm = 'form1';

    user_login: string = '';
    user_pass: string = '';
    user_email: string = '';
    name: string = '';
    mobile: string = '';
    gender: string = 'm';
    birthday: DATEPICKER;

    files: FILES = [];


    errorMessage: string = null;
    loading: boolean = false;

    now = (new Date());

    constructor(
        public app: AppService,
        private router: Router,
        dateConfig: NgbDatepickerConfig
    ) {
        super();
        app.section('user');
        dateConfig.minDate = {year: 1956, month: 1, day: 1};
        dateConfig.maxDate = {year: this.now.getFullYear(), month: 12, day: 31};
    }

    ngOnInit() {
        this.birthday = {
            year: this.now.getFullYear(),
            month: this.now.getMonth() + 1,
            day: this.now.getDate()
        };
    }


    onSubmitRegister() {
        // console.log('onClickUserRegister::');
        this.errorMessage = null;
        if (!this.user_email && this.user_email.length == 0) return this.errorMessage = '*Email is required';
        if (!this.user_pass && this.user_pass.length == 0) return this.errorMessage = '*Password is required';

        this.loading = true;
        let data: USER_REGISTER = {
            user_login: this.user_email,
            user_pass: this.user_pass,
            user_email: this.user_email,
            // timezone_offset: this.getTimezoneOffset()
        };
        this.app.user.register(data).subscribe(res => {
            // console.log('app.user.register::res', res);
            if (res.session_id) {
                // console.log('Registration Success::Proceed to Profile Photo');
                this.activeForm = 'form2';
            }
            this.loading = false;
            this.app.loginSuccess();
        }, error => {
            // console.log('app.user.register::error', error);
            this.loading = false;
            this.app.warning(error);
            this.errorMessage = error.code
        });
    }

    onSuccessUpdateProfilePicture() {
        // console.log("onSuccessUpdateProfilePicture::", this.files);
        let data: USER_UPDATE = {
            user_email: this.user_email,
            photoURL: this.files[0].url
        };
        if( this.files.length > 1 ) {
            data['photoURL']= this.files[1].url;
            setTimeout( () => this.fileUploadComponent.deleteFile( this.files[0]) );
        }
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            this.app.userUpdate({photoUrl: data['photoURL'] }, () => {});
            // console.log('updateProfilePicture:', res);
            this.app.rerenderPage();
        }, err => {
            // console.log('error while updating user profile picture', err);
        });
    }

    onSubmitUpdateUserInfo() {
        this.errorMessage = null;
        this.loading = true;
        let data: USER_UPDATE = {
            user_email: this.user_email,
            name: this.name,
            display_name: this.name,
            mobile: this.mobile,
            gender: this.gender,
            birthday: this.birthday.year + this.app.add0(this.birthday.month) + this.app.add0(this.birthday.day)
        };
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
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
            // console.log('error while updating user profile picture', err);
            this.errorMessage = err.code;
        });
    }

}
