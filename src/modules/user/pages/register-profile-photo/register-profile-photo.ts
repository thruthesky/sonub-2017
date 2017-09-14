import { Component, ViewChild } from '@angular/core';
import { FILES, USER_UPDATE, USER_UPDATE_RESPONSE } from "../../../../providers/wordpress-api/interface";
import { AppService } from "../../../../providers/app.service";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";

@Component({
    selector: 'register-profile-photo-page',
    templateUrl: 'register-profile-photo.html'
})

export class RegisterProfilePhotoPage {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    registerHeaderHTML2 = '';
    files: FILES = [];

    constructor(
        public app: AppService
    ) {
        app.section('user');
        app.page.cache('register-header2', {}, html => this.registerHeaderHTML2 = html );
    }

    onSuccessUpdateProfilePicture() {
        // console.log("onSuccessUpdateProfilePicture::", this.files);
        let data: USER_UPDATE = {
            user_email: this.app.user.email,
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

}


