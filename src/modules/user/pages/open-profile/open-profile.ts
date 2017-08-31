import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../../../providers/app.service';

import { USER_DATA_RESPONSE } from './../../../../providers/wordpress-api/interface';


@Component({
    selector: 'open-profile-page',
    templateUrl: './open-profile.html'
})
export class OpenProfilePage implements OnInit {

    id;
    data;

    constructor(
        private active: ActivatedRoute,
        public app: AppService
    ) {
        app.section('user');
        active.params.subscribe(params => {
            if ( params['id'] ) {
                this.id = params['id'];
                this.initProfile();
            }
        });

    }

    ngOnInit() {

    }

    initProfile() {
        this.app.user.openProfile( this.id ).subscribe( (res:USER_DATA_RESPONSE) => {
            // console.log('open profile::', res);
            this.data = res;
        }, error => this.app.warning(error));
    }


}
