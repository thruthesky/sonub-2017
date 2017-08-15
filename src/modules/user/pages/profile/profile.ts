import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import { USER_DATA_RESPONSE } from './../../../../providers/wordpress-api/interface';
import {ProfileEditModalService} from "../modals/profile-edit/profile-edit.modal";


@Component({
    selector: 'profile-page',
    templateUrl: './profile.html'
})
export class ProfilePage implements OnInit {

    userData: USER_DATA_RESPONSE = <USER_DATA_RESPONSE>{};

    constructor(
        public app: AppService,
        private profileEditModal: ProfileEditModalService
    ) {
        app.section('user');
        this.initProfile();
    }

    ngOnInit() {

    }


    initProfile() {
        this.app.user.data().subscribe( (res:USER_DATA_RESPONSE) => {
            console.log('userData::', res);
            this.userData = res;
        }, error => this.app.warning(error));
    }


    onClickEditProfile() {
        this.profileEditModal.open(this.userData).then(id => {
            // console.log('comment edit success:', id);

            this.initProfile();

        }, err => this.app.warning(err));
    }
}
