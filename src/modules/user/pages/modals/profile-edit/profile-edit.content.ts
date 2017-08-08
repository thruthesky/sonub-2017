import {Component, OnInit, ViewChild} from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppService } from './../../../../../providers/app.service';
import {
    FILES, USER_UPDATE, USER_UPDATE_RESPONSE
} from './../../../../../providers/wordpress-api/interface';
import {FileUploadWidget} from "../../../../../widgets/file-upload/file-upload";
import {_DATE} from "../../register/register";

@Component({
    selector: 'profile-edit-content',
    templateUrl: 'profile-edit.content.html'
})

export class ProfileEditContent implements OnInit {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;


    user_email: string = '';
    name: string = '';
    mobile: string = '';
    gender: string = 'm';
    birthday: _DATE;


    user: USER_UPDATE = <USER_UPDATE>{};
    files: FILES;


    errorMessage: string = null;
    loading: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService,
    ) { }

    ngOnInit() { }

    setOptions(userData) {
        Object.assign( this.user,  userData);

        this.user_email = userData.user_email;
        this.name = userData.name;
        this.mobile = userData.mobile;
        this.gender = userData.gender;

        this.birthday = {
            year: parseInt( userData.birthday.substring(0,4) ),
            month: parseInt( userData.birthday.substring(4,6) ),
            day: parseInt( userData.birthday.substring(6,8) )
        };


        this.files = [userData.photo];
        console.log('editUserOption::', this.birthday);
    }

    onClickCancel() {
        this.activeModal.close();
    }

    onSuccessUpdateProfile() {
        console.log("onSuccessUpdateProfile::", this.files);
        let data: USER_UPDATE = {
            user_email: this.user.user_email,
            photoURL: this.files[0].url
        };
        if( this.files.length > 1 ) {
            data['photoURL']= this.files[1].url;
            setTimeout( () => this.fileUploadComponent.deleteFile( this.files[0]) );
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
            display_name: this.name,
            mobile: this.mobile,
            gender: this.gender,
            birthday: this.birthday.year + this.add0(this.birthday.month) + this.add0(this.birthday.day)
        };
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            console.log('updateUserInfo:', res);
            this.loading = false;
            this.activeModal.close();
            this.app.rerenderPage();
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
