import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as firebase from 'firebase/app';

import { AppService } from './../../../../providers/app.service';
import { SOCIAL_PROFILE } from './../../../../providers/wordpress-api/interface';



@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})

export class LoginPage implements OnInit, AfterViewInit {

    user_login;
    user_pass;
    loginHeaderHTML;
    loginBottomHTML;
    constructor(
        public app: AppService
    ) {

        app.section('user');
        app.page.cache('login-header', {}, re => this.loginHeaderHTML = re);
        app.page.cache('login-bottom', {}, re => this.loginBottomHTML = re);
        
    }

    ngOnInit() {
        // console.log("LoginPage::ngOnInit() ...");
    }

    ngAfterViewInit() {
        
    }



    firebaseSocialLoginSuccess(user: firebase.User) {
        let profile: SOCIAL_PROFILE = {
            providerId: user.providerId,
            name: user.displayName,
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL
        };

        
        // console.log('LoginPage::firebaseSocialLoginSuccess() ==> app::socialLoginSuccess(): ', profile);
        this.app.socialLoginSuccess(profile, () => {
            // console.log("LoginPage::firebaseSocialLoginSuccess() ==>  app::socialLoginSuccess() ==> app::loginSuccess()");
            this.app.loginSuccess(() => this.app.goHome());
        });
    }

    firebaseSocialLogniError(e) {
        // console.log(e);
        // Handle Errors here.
        this.app.warning(e);
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
        // console.log("onSubmitLogin() : ...");
        this.app.user.login(this.user_login, this.user_pass).subscribe(profile => {
            // console.log("app.user.login: ", profile);
            this.app.loginSuccess(() => this.app.goHome());
        }, err => this.app.warning(err));

    }



    onClickLoginWithKakao() {
        // open login popup
        this.app.kakao.Auth.login({
            success: (authObj) => {
                // Get user information
                this.app.kakao.API.request({
                    url: '/v1/user/me',
                    success: (res) => {

                        // console.log('Kakoa login success: ', res);

                        let nickname = '';
                        let photoURL = '';
                        let id = '';
                        let email = '';

                        try {
                            id = res.id;
                            email = res['kaccount_email'] ? res['kaccount_email'] : '';
                            if (res['properties'] && res['properties']['nickname']) nickname = res['properties']['nickname'];
                            photoURL = res.properties.profile_image;
                        }
                        catch (e) { }


                        let profile: SOCIAL_PROFILE = {
                            providerId: 'kakao',
                            name: nickname,
                            uid: id + '@kakao',
                            email: email,
                            photoURL: photoURL
                        };

                        // console.log('Kakoa profile: ', profile);
                        this.app.socialLoginSuccess(profile, () => {
                            // console.log("Kakao social login success");
                            this.app.loginSuccess(() => this.app.goHome());
                        });

                    },
                    fail: function (error) {
                        // this is error.
                        // alert(JSON.stringify(error));
                    }
                });

            },
            fail: function (err) {
                // this is error.
                // alert(JSON.stringify(err));
            }
        });
    }


    onClickLoginWithNaver() {
        this.app.loginWithNaver();
    }


    cordovaFirebaseAuthLogin(provider) {
        // console.log('LoginPage::cordovaFirebaseAuthLogin() ==> SignInWithRedirect(provider)');
        firebase.auth().signInWithRedirect(provider).then(() => {
            // console.log('LoginPage::cordovaFirebaseAuthLogin() ==> SignInWithRedirect(provider) ==> success ==> getRedirctResult()');
            firebase.auth().getRedirectResult().then(result => {
                // var token = result.credential.accessToken;
                let user = result.user;
                // console.log("LoginPage::cordovaFirebaseAuthLogin() ==> login success. ", user);
                this.firebaseSocialLoginSuccess(user);
            })
                .catch(e => this.firebaseSocialLogniError(e));
        });
    }

    onClickLoginWithCordovaGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider();
        this.cordovaFirebaseAuthLogin( provider );
    }

    onClickLoginWithCordovaFacebook() {
        let provider = new firebase.auth.FacebookAuthProvider();
        this.cordovaFirebaseAuthLogin( provider );
    }


}
