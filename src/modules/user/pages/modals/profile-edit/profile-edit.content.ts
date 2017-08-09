import {Component, OnInit, ViewChild} from '@angular/core';

import {NgbModal, NgbActiveModal, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

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
    files: FILES = [];


    errorMessage: string = null;
    loading: boolean = false;

    now = (new Date());

    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService,
        dateConfig: NgbDatepickerConfig
    ) {
        app.title('register');
        dateConfig.minDate = {year: 1956, month: 1, day: 1};
        dateConfig.maxDate = {year: this.now.getFullYear(), month: 12, day: 31};
    }

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


        if( userData.photo ) this.files[0] = userData.photo;
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
            birthday: this.birthday.year + this.app.add0(this.birthday.month) + this.app.add0(this.birthday.day)
        };
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            console.log('updateUserInfo:', res);
            this.loading = false;
            this.activeModal.close();
            this.app.rerenderPage();
        }, err => {
            this.loading = false;
            console.log('error while updating user profile picture', err);
            this.errorMessage = err.code + ' , '+ err.message;
        });
    }



    onChangeBirthday() {
        console.log(this.birthday);
    }

}
