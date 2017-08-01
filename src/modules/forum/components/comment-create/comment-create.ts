import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE
} from './../../../../providers/wordpress-api/interface';

import { FileUploadComponent } from './../../../../components/file-upload/file-upload';

import { AlertModalService } from './../../../../providers/modals/alert/alert.modal';


@Component({
    selector: 'comment-create-component',
    templateUrl: 'comment-create.html'
})

export class CommentCreateComponent implements OnInit, AfterViewInit {

    @Input() post: POST;
    @Input() comment: COMMENT;
    @ViewChild('fileUploadComponent') fileUploadComponent: FileUploadComponent;
    files: FILES = [];
    comment_content: string;
    @Output() create = new EventEmitter<number>();
    constructor(
        public app: AppService,
        private alert: AlertModalService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        // setTimeout( () => this.checkCommentComment(), 10 );
    }

    // checkCommentComment() {

    // }

    onSubmit() {
        
        this.app.rerenderPage();
        this.app.warning('hi');

        console.log(this.comment_content);
        let req: COMMENT_CREATE = {
            comment_post_ID: this.post.ID,
            comment_content: this.comment_content
        };

        req.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        if (this.comment && this.comment.comment_ID) req.comment_parent = this.comment.comment_ID;
        this.app.forum.commentCreate(req).subscribe((id: COMMENT_CREATE_RESPONSE) => {
            console.log("comment created", id);
            this.files = [];
            this.comment_content = '';
            this.insertComment( id );
            this.create.emit(id);
        }, err => {
            this.app.warning(err);
            // this.alert.open("error !!");
        });



    }

    insertComment(comment_ID) {
        this.app.forum.commentData(comment_ID).subscribe((comment: COMMENT) => {
            console.log(comment);
            if (comment.comment_parent == 0) this.post.comments.unshift(comment);
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