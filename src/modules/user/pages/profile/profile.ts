import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import { USER_DATA_RESPONSE } from './../../../../providers/wordpress-api/interface';
import {ERROR} from "../../../../etc/error";
import {Router} from "@angular/router";


@Component({
    selector: 'profile-page',
    templateUrl: './profile.html'
})
export class ProfilePage implements OnInit {

    userData: USER_DATA_RESPONSE = <USER_DATA_RESPONSE>{};

    text: any = {};
    constructor(
        public app: AppService,
        private router: Router
    ) {
        app.section('user');
        this.initProfile();
        let codes = [
            'user_profile',
            'user_profile_desc',
        ];
        app.wp.text(codes, re => this.text = re);
    }

    ngOnInit() {

    }


    initProfile() {
        this.app.user.data().subscribe( (res:USER_DATA_RESPONSE) => {
            console.log('userData::', res);
            this.userData = res;
        }, error => this.app.warning(error));
    }

    onClickResign() {
        if (this.app.user.isLogin) {
            this.app.confirm(this.app.text('resign')).then(code => {
                if (code == 'yes') {
                    console.log('confirmResign');
                    this.app.user.resign().subscribe( res => {
                        console.log('resign:res', res);
                        this.router.navigateByUrl('/');
                    }, err => this.app.warning(err));
                }
            }, () => {});
        }
        else {
            this.app.warning(ERROR.CODE_PERMISSION_DENIED_NOT_OWNER);
        }

    }

    logout(){
        this.app.logout();
        this.router.navigateByUrl('/');
    }
}
