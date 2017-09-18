import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { USER_REGISTER, USER_REGISTER_RESPONSE } from "../../../../providers/wordpress-api/interface";
import { AppService } from "../../../../providers/app.service";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";

@Component({
    selector: 'register-with-email-page',
    templateUrl: 'register-with-email.html'
})
export class RegisterWithEmailPage {

    registerHeaderHTML1 = '';

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    user_pass: string = '';
    user_email: string = '';

    errorMessage: string = null;
    loading: boolean = false;

    text: any = {};
    constructor(public app: AppService,
        private router: Router
    ) {
        app.section('user');
        app.page.cache('register-header1', {}, html => this.registerHeaderHTML1 = html);
        app.wp.text(['register_email_desc', 'register_password_desc'], re => this.text = re);
    }


    error(code, message) {
        let e = {
            code: code,
            message: message
        };
        this.errorMessage = e.message;
        this.app.warning(e);
        return;
    }

    onSubmitRegister() {
        console.log('onClickUserRegister::');

        this.errorMessage = null;
        if (!this.user_email && this.user_email.length == 0) return this.error(-8071, 'Email is required');
        if (!this.user_pass && this.user_pass.length == 0) return this.error(-8072, 'Password is required');

        this.loading = true;
        let data: USER_REGISTER = {
            user_login: this.user_email,
            user_pass: this.user_pass,
            user_email: this.user_email,
            // timezone_offset: this.getTimezoneOffset()
        };
        this.app.user.register(data).subscribe( (res: USER_REGISTER_RESPONSE) => {
            // console.log('app.user.register::res', res);


            this.app.loginSuccess(); /// @warning @see doc #No-wait
            if (res.session_id) {
                // console.log('Registration Success::Proceed to Profile Photo');
                this.router.navigateByUrl('user/register/profile-photo');
            }
            this.loading = false;
        }, error => {
            // console.log('app.user.register::error', error);
            this.loading = false;
            this.app.warning(error);
            // alert( JSON.parse(error));
            this.errorMessage = this.app.getErrorString(error);

        });
    }
}
