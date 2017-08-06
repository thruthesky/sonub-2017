import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FILES, USER_REGISTER, USER_UPDATE, USER_UPDATE_RESPONSE } from "../../../../providers/wordpress-api/interface";
import { AppService } from "../../../../providers/app.service";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";

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

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;
    activeForm = 'form1';

    user_login: string = '';
    user_pass: string = '';
    user_email: string = '';
    name: string = '';
    mobile: string = '';
    gender: string = 'm';
    address: string = '';
    birthday: _DATE;
    landline: string = '';

    files: FILES = [];


    errorMessage: string = null;
    loading: boolean = false;

    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    now = (new Date());

    constructor(
        public app: AppService,
        private router: Router
    ) {
        app.title('register');
    }

    ngOnInit() {
        this.birthday = {
            year: this.now.getFullYear(),
            month: this.now.getMonth() + 1,
            day: this.now.getDate()
        };
    }


    onSubmitRegister() {
        console.log('onClickUserRegister::');
        this.errorMessage = null;
        if (!this.user_email && this.user_email.length == 0) return this.errorMessage = '*Email is required';
        if (!this.user_pass && this.user_pass.length == 0) return this.errorMessage = '*Password is required';

        this.loading = true;
        let data: USER_REGISTER = {
            user_login: this.user_email,
            user_pass: this.user_pass,
            user_email: this.user_email
        };
        this.app.user.register(data).subscribe(res => {
            console.log('app.user.register::res', res);
            if (res.session_id) {
                console.log('Registration Success::Proceed to Profile Photo');
                this.activeForm = 'form2';
            }
            this.loading = false;
        }, error => {
            console.log('app.user.register::error', error);
            this.loading = false;
            this.app.warning(error);
            this.errorMessage = error.code
        });
    }

    onSuccessUpdateProfile() {
        console.log("onSuccessUpdateProfile::", this.files);
        let data: USER_UPDATE = {
            user_email: this.user_email,
            photoID: this.files[0].id,
            photoURL: this.files[0].url
        };
        if (this.files.length > 1) {
            data['photoID'] = this.files[1].id;
            data['photoURL'] = this.files[1].url;
            setTimeout(() => this.fileUploadComponent.deleteFile(this.files[0]));
        }
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            console.log('updateProfilePicture:', res);
        }, err => {
            console.log('error while updating user profile picture', err);
        });
    }

    onSubmitUpdateUserInfo() {
        this.errorMessage = null;
        this.loading = true;
        let data: USER_UPDATE = {
            user_email: this.user_email,
            name: this.name,
            mobile: this.mobile,
            gender: this.gender,
            address: this.address,
            birthday: this.birthday.year + this.add0(this.birthday.month) + this.add0(this.birthday.day),
            landline: this.landline
        };
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            console.log('updateUserInfo:', res);
            this.loading = false;
            this.router.navigateByUrl('/');
        }, err => {
            this.loading = false;
            console.log('error while updating user profile picture', err);
            this.errorMessage = err.code;
        });
    }

    add0(n: number): string {
        return n < 10 ? '0' + n : n.toString();
    }

    onChangeBirthday() {
        console.log(this.birthday);
    }
}
