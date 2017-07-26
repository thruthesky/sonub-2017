import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE
} from './../../../../providers/wordpress-api/interface';

import { CommentEditModalService } from './../../modals/comment-edit/comment-edit.modal';



@Component({
    selector: 'comment-view-component',
    templateUrl: 'comment-view.html'
})

export class CommentViewComponent implements OnInit, AfterViewInit {

    @Input() post: POST;
    @Input() comment: COMMENT;
    files: FILES = [];
    comment_content: string;
    showReply: boolean = false;
    constructor(
        public app: AppService,
        private commentEditModal: CommentEditModalService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        // setTimeout( () => this.checkCommentComment(), 10 );
    }


    onCreate( comment_ID ) {
        this.showReply = false;
    }

    onClickEdit() {

        this.commentEditModal.open(this.post, this.comment).then(res => {
            console.log('comment edit success:', res);
        }, err => this.app.warning(err));

    }

    onClickDelete() {

        if (this.app.user.isLogin) {
            if (this.app.confirm('Do you want to delete this comment?')) {
                this.app.forum.commentDelete(this.comment.comment_ID).subscribe(id => {
                    console.log('success delete: ', id);
                }, e => this.app.warning(e));
            }
        }
        else {
            this.app.warning('Please login to delete comment');
        }

    }
}

