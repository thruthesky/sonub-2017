import {Component} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { AppService } from './../../../../../providers/app.service';
import {
    USER_CHANGE_PASSWORD
} from './../../../../../providers/wordpress-api/interface';

@Component({
    selector: 'profile-change-password-content',
    templateUrl: 'profile-change-password.content.html'
})

export class ProfileChangePasswordContent {


    new_password: string = null;
    old_password: string = null;

    errorMessage: string = null;
    loading: boolean = false;


    constructor(public activeModal: NgbActiveModal,
                public app: AppService) {
    }

    onSubmitChangePassword() {
        console.log('onSubmitChangePassword');
        this.errorMessage = '';
        this.loading = false;
        if( !this.old_password ) return this.errorMessage =  '*Old Password is Required!';
        if( !this.new_password ) return this.errorMessage =  '*New Password is Required!';
        this.loading = true;

        let data: USER_CHANGE_PASSWORD = {
            old_password: this.old_password,
            new_password: this.new_password
        };
        this.app.user.changePassword(data).subscribe( res => {
            console.log('changePassword::res',res);
            this.loading = false;
            this.app.confirm(this.app.text('changePassword')).then(() => {
                this.activeModal.close();
            });

        }, err =>{
            this.app.warning(err);
            this.loading = false;
        });
    }

    onClickCancel() {
        this.activeModal.close();
    }

}

