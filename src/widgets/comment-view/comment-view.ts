import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { ForumCodeShareService } from './../../modules/forum/forum-code-share.service';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE
} from './../../providers/wordpress-api/interface';

import { CommentEditModalService } from './../../modules/forum/modals/comment-edit/comment-edit.modal';

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'comment-view-widget',
    templateUrl: 'comment-view.html'
})

export class CommentViewWidget implements OnInit, AfterViewInit {

    @Input() post: POST;
    @Input() comment: COMMENT;
    files: FILES = [];
    comment_content: string;
    showReply: boolean = false;


    ////
    mouse: 'in' | 'out' = 'out';
    timeout = 600;
    closingTimeout = 400;

    ////
    @ViewChild('profileDropdown') public profileDropdown: NgbDropdown;

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

        }, err => this.app.warning(err))
        .catch( e => this.app.warning(e) );
    }

    onClickDelete() {

        if (this.app.user.isLogin) {
            this.app.confirm(this.app.text('confirmDelete')).then(code => {
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
            }, () => {})
        }
        else {
            this.app.warning('Please login to delete comment');
        }

    }



    onClickLike( choice: 'like' | 'dislike' ) {
        if ( this.app.user.isLogout ) return this.app.warning( this.app.e.LOGIN_FIRST );
        this.app.wp.post({route: 'wordpress.comment_like', choice: choice, comment_ID: this.comment.comment_ID, session_id: this.app.user.sessionId})
            .subscribe( re => {
                console.log("like: ", re);
                this.comment.meta['like'] = re['like'];
                this.comment.meta['dislike'] = re['dislike'];

            }, e => this.app.warning(e));
    }



    onClickUserProfile(event: MouseEvent) {
        if ( event ) event.stopPropagation();
        this.profileDropdown.open();
    }


    onMouseEnterUserProfile(event: MouseEvent) {
        this.mouse = 'in';
        setTimeout(() => {
            if ( this.mouse == 'in' ) this.profileDropdown.open();
        }, this.timeout );
    }

    onMouseLeaveUserProfileMenu() {
        this.mouse = 'out';
        setTimeout( () => {
            if ( this.mouse == 'out' ) this.profileDropdown.close();
        }, this.closingTimeout);
    }


}

