import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';

import { AppService, SOCIAL_PROFILE } from './../../../../providers/app.service';


@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})

export class LoginPage implements OnInit {
    constructor(
        private app: AppService
    ) {

    }

    ngOnInit() {
        console.log("LoginPage::ngOnInit() ...");
    }



    firebaseSocialLoginSuccess(user: firebase.User) {
        let profile: SOCIAL_PROFILE = {
            providerId: user.providerId,
            name: user.displayName,
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL
        };

        this.app.user.socialLoginSuccess(user, () => {
            console.log("firebase social login success");
        });


        // this.app.socialLoggedIn(profile, () => {
        //   console.log('onClickLoginWithGoogle() finished.');
        //   this.loggedIn();
        // });
    }

    firebaseSocialLogniError(e) {
        // Handle Errors here.
        this.app.displayError(e);
    }



    onClickLoginWithGoogle() {
        this.app.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((res) => this.firebaseSocialLoginSuccess(res.user))
            .catch(e => this.firebaseSocialLogniError(e));
    }


}