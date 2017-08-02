import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
import { ForumCodeShareService } from './../../forum-code-share.service';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE
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
        private commentEditModal: CommentEditModalService,
        private forumShare: ForumCodeShareService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        // setTimeout( () => this.checkCommentComment(), 10 );
    }


    onCreate(comment_ID) {
        this.showReply = false;
    }

    onClickEdit() {
        this.commentEditModal.open(this.post, this.comment).then(id => {
            // console.log('comment edit success:', id);

        }, err => this.app.warning(err));
    }

    onClickDelete() {

        if (this.app.user.isLogin) {
            this.app.confirm(this.app.text('deleteConfirm')).then(code => {
                if (code == 'yes') {
                    this.app.forum.commentDelete(this.comment.comment_ID).subscribe(res => {
                        console.log('success delete: ', res);
                        if ( res.mode == 'mark' ) {
                            this.forumShare.updateComment( this.comment );
                        }
                        else {
                            let index = this.post.comments.findIndex( comment => comment.comment_ID == res.comment_ID );
                            this.post.comments.splice( index, 1 );
                        }
                        
                    }, e => this.app.warning(e));
                }
            })
        }
        else {
            this.app.warning('Please login to delete comment');
        }

    }


    
}

