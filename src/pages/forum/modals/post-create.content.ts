import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppService } from './../../../providers/app.service';
import { POST_CREATE, POST_CREATE_RESPONSE } from './../../../providers/wordpress-api/interface';



@Component({
    selector: 'post-create-content',
    templateUrl: 'post-create.content.html'
})

export class PostCreateContent implements OnInit {

    /// forms
    post_title;
    post_content;
    post_author;
    post_author_email;
    post_author_phone_number;
    post_password;

    /// callbacks
    // successCallback;
    // failureCallback;
    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService
    ) { }

    ngOnInit() { }



    onClickSubmit() {

        let data: POST_CREATE = {
            category: 'abc',
            post_title: this.post_title,
            post_content: this.post_content,
            post_author: this.post_author,
            post_author_email: this.post_author_email,
            post_author_phone_number: this.post_author_phone_number,
            post_password: this.post_password
        };
        this.app.forum.postCreate(data).subscribe((ID: POST_CREATE_RESPONSE) => {
            console.log(ID)
            // this.successCallback(ID);
            this.activeModal.close(ID);
        }, err => {
            // this.app.displayError( this.app.getErrorString( err ) );
            // this.failureCallback( this.app.getErrorString(err) );
            this.app.displayError(this.app.getErrorString(err));
        });



    }


    onClickCancel() {
        // this.failureCallback("Do you really want to leave? there is unsaved content.");

        // this.failureCallback('cancelled');
        this.activeModal.dismiss('cancelled');
    }
}