import {
    Component, OnInit, Input, Output, AfterViewInit, ViewChild, EventEmitter
} from '@angular/core';


import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import { AppService } from './../../providers/app.service';


import {
    POST, FILES,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE, SITE_PREVIEW, SITE_PREVIEW_FACTORY
} from './../../providers/wordpress-api/interface';

import { FileUploadWidget } from '../file-upload/file-upload';
import { AlertModalService } from './../../providers/modals/alert/alert.modal';

import { SitePreview } from './../../etc/site-preview';


@Component({
    selector: 'comment-create-widget',
    templateUrl: 'comment-create.html'
})

export class CommentCreateWidget implements OnInit, AfterViewInit {

    @Input() post: POST;
    @Input() comment: COMMENT;
    @ViewChild('fileUploadWidget') fileUploadComponent: FileUploadWidget;
    files: FILES = [];
    comment_content: string;
    @Output() create = new EventEmitter<number>();


    preview: SitePreview;

    constructor(
        public app: AppService,
        private alert: AlertModalService
    ) {
        this.preview = new SitePreview( app.forum );
    }

    get userPhotoURL() {

        if (this.app.user.isLogin && this.app.user.profile.photoURL) {
            return this.app.user.profile.photoURL;
        }
        else return null;
    }

    ngOnInit() {
        this.preview.listen();
    }

    ngAfterViewInit() {
        // setTimeout( () => this.checkCommentComment(), 10 );


    }

    // checkCommentComment() {

    // }

    onSubmit() {

        // let box = document.getElementById('comment-create-content-box');
        // box.blur();

        console.log(this.comment_content);
        let req: COMMENT_CREATE = {
            comment_post_ID: this.post.ID,
            comment_content: this.comment_content,
            site_preview_id: this.preview.id
        };

        req.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        if (this.comment && this.comment.comment_ID) req.comment_parent = this.comment.comment_ID;
        this.app.forum.commentCreate(req).subscribe((re: COMMENT_CREATE_RESPONSE) => {
            let id = re.comment_ID;
            console.log("comment created", re);
            this.insertComment(id);


            this.resetForm();

            this.create.emit(id);

        }, err => {
            this.app.warning(err);
            // this.alert.open("error !!");
        });


    }

    resetForm() {
        this.files = [];
        this.comment_content = '';
        this.preview.result = null;
    }

    // sendMessage(re: COMMENT_CREATE_RESPONSE) {

    //     if (re.tokens.length) {
    //         let name = this.app.user.nameOrAnonymous.replace(/\s+/g, ' ').trim();
    //         name = this.app.text( 'replied', { name: name } );
    //         let body = this.comment_content.replace(/\s+/g, ' ').trim();
    //         let url = this.app.forum.postUrl( re.post_ID );

    //         for (let token of re.tokens) {
    //             this.app.push.send(token, name, body, url)
    //                 .subscribe(
    //                     res => console.log(res),
    //                     err => console.log(err));
    //         }
    //     }
    // }

    insertComment(comment_ID) {
        this.app.forum.commentData(comment_ID).subscribe((comment: COMMENT) => {
            console.log(comment);
            if (!this.post.comments) this.post['comments'] = [];

            if (comment.comment_parent == 0) {
                this.post.comments.unshift(comment);
            }
            else {
                let index = this.post.comments.findIndex(c => c.comment_ID == comment.comment_parent);
                if (index == -1) {
                    // error. Maybe parent comment has been completely deleted by admin while a reply of that comment.
                    this.post.comments.unshift(comment);
                }
                else {
                    comment['depth'] = this.post.comments[index].depth + 1;
                    this.post.comments.splice(index + 1, 0, comment);
                }
            }
        }, e => this.app.warning(e));
    }



}
