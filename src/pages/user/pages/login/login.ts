import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase/app';

import { AppService } from './../../../../providers/app.service';
import { SOCIAL_PROFILE } from './../../../../providers/wordpress-api/interface';



@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})

export class LoginPage implements OnInit {

    user_login;
    user_pass;
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

        // console.log('firebaseSocial: ', profile);
        this.app.socialLoginSuccess(profile, () => {
            console.log("firebase social login success");
            this.app.loginSuccess();
        });

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

    onClickLoginWithFacebook() {
        this.app.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then((res) => this.firebaseSocialLoginSuccess(res.user))
            .catch(e => this.firebaseSocialLogniError(e));
    }


    onSubmitLogin() {

        this.app.user.login( this.user_login, this.user_pass).subscribe( profile => {
            console.log( profile );
            this.app.loginSuccess();
        }, err => this.app.displayError( err ) );

    }


}
