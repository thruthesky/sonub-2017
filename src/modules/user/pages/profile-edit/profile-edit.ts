import {Component, OnInit, ViewChild} from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import {
    FILES, USER_DATA_RESPONSE, USER_UPDATE,
    USER_UPDATE_RESPONSE
} from './../../../../providers/wordpress-api/interface';
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {FileUploadWidget} from "../../../../widgets/file-upload/file-upload";
import {DATEPICKER} from "../../../../etc/interface";
import {Router} from "@angular/router";



@Component({
    selector: 'profile-edit-page',
    templateUrl: './profile-edit.html'
})
export class ProfileEditPage implements OnInit {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;


    user_email: string = '';
    name: string = '';
    mobile: string = '';
    gender: string = 'm';
    birthday: DATEPICKER;
    files: FILES = [];


    errorMessage: string = null;
    loading: boolean = false;

    now = (new Date());

    text: any = {};

    constructor(
        public app: AppService,
        private router: Router,
        dateConfig: NgbDatepickerConfig
    ) {
        app.section('user');
        dateConfig.minDate = {year: 1956, month: 1, day: 1};
        dateConfig.maxDate = {year: this.now.getFullYear(), month: 12, day: 31};
        this.initProfile();
        let codes = [
            'user_profile_edit',
            'user_profile_edit_desc',
        ];
        app.wp.text(codes, re => this.text = re);
    }

    ngOnInit() {

    }

    initProfile() {
        this.app.user.data().subscribe( (userData:USER_DATA_RESPONSE) => {
            console.log('userData::', userData);
            this.user_email = userData.user_email;
            this.name = userData.display_name;
            this.mobile = userData.mobile;
            this.gender = userData.gender;
            this.birthday = {
                year: parseInt( userData.birthday.substring(0,4) ),
                month: parseInt( userData.birthday.substring(4,6) ),
                day: parseInt( userData.birthday.substring(6,8) )
            };
            if( userData.photo ) this.files[0] = userData.photo;
        }, error => this.app.warning(error));
    }

    onSuccessUpdateProfilePicture() {
        console.log("onSuccessUpdateProfile::", this.files);
        let data: USER_UPDATE = {
            user_email: this.user_email,
            photoURL: this.files[0].url
        };
        if( this.files.length > 1 ) {
            data['photoURL']= this.files[1].url;
            if( this.files && this.files[0] && this.files[0].id ) setTimeout( () => this.fileUploadComponent.deleteFile( this.files[0]) );
        }
        this.app.user.update(data).subscribe((res: USER_UPDATE_RESPONSE) => {
            this.app.userUpdate({photoUrl: data['photoURL'] }, () => {});
            console.log('updateProfilePicture:', res);
            this.files[0] = res.photo;
            this.app.rerenderPage();
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
            let userData = {
                name: data['name']
            };
            this.app.userUpdate( userData, () => {
                this.loading = false;
                this.router.navigateByUrl('/profile');
            });
        }, err => {
            this.loading = false;
            console.log('error while updating user profile picture', err);
            this.errorMessage = err.code + ' , '+ err.message;
        });
    }

}
