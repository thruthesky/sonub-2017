import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppService } from './../../../../providers/app.service';
import {
    POST, POST_CREATE, POST_CREATE_RESPONSE, POST_UPDATE, POST_UPDATE_RESPONSE,
    FILES, FILE
} from './../../../../providers/wordpress-api/interface';



export interface OPTIONS {
    category?: string;
    post?: POST;
};


@Component({
    selector: 'post-create-edit-content',
    templateUrl: 'post-create-edit.content.html'
})

export class PostCreateEditContent implements OnInit {

    ///
    options: OPTIONS;

    /// forms
    post_title;
    post_content;
    post_author_name;
    post_author_email;
    post_author_phone_number;
    post_password;

    /// files
    files: FILES = [];

    /// callbacks
    // successCallback;
    // failureCallback;
    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService
    ) { }

    ngOnInit() { }



    setOptions(options: OPTIONS) {
        this.options = options;
        if (options.post) {
            this.post_title = options.post.post_title;
            this.post_content = options.post.post_content;
            this.post_author_name = options.post.author.name;
            this.post_author_email = options.post.author.email;
            this.post_author_phone_number = options.post.author.phone_number;
            this.files = Array.from(options.post.files);
        }
    }


    onClickSubmit() {

        let data: POST_CREATE = {
            category: this.options.category,
            post_title: this.post_title,
            post_content: this.post_content,
            post_author_name: this.post_author_name,
            post_author_email: this.post_author_email,
            post_author_phone_number: this.post_author_phone_number,
            post_password: this.post_password
        };


        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        console.log(data);

        this.app.forum.postCreate(data).subscribe((ID: POST_CREATE_RESPONSE) => {
            console.log(ID);
            this.activeModal.close(ID);
        }, err => {
            this.app.displayError(err);
        });



    }

    onClickEdit() {
        let data: POST_UPDATE = {
            ID: this.options.post.ID,
            post_title: this.post_title,
            post_content: this.post_content
        };
        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        if (!this.app.user.isLogin) {
            if (this.post_password) data.post_password = this.post_password;
            if (this.post_author_name) data.post_author_name = this.post_author_name;
            if (this.post_author_email) data.post_author_email = this.post_author_email;
            if (this.post_author_phone_number) data.post_author_phone_number = this.post_author_phone_number;
        }


        this.app.forum.postUpdate(data).subscribe(ID => {
            console.log("update: ", ID);
            this.activeModal.close(ID);
        }, err => this.app.warning(err));
    }


    onClickCancel() {
        // this.failureCallback("Do you really want to leave? there is unsaved content.");

        // this.failureCallback('cancelled');
        this.activeModal.dismiss('cancelled');
    }
}