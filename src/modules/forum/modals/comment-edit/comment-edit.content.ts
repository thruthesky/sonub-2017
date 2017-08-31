import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppService } from './../../../../providers/app.service';
import {
    FILES, FILE, COMMENT, POST, COMMENT_UPDATE
} from './../../../../providers/wordpress-api/interface';


import { ForumCodeShareService } from './../../forum-code-share.service';


import { SitePreview } from '../../../../etc/site-preview';

@Component({
    selector: 'comment-edit-content',
    templateUrl: 'comment-edit.content.html'
})

export class CommentEditContent implements OnInit {


    //
    comment_content;


    // origial post, comment
    post: POST;
    comment: COMMENT;


    // files ( not referenced. )
    files: FILES = [];


    preview: SitePreview;

    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService,
        private forumShare: ForumCodeShareService
    ) {
        this.preview = new SitePreview( app.forum ).listen();
        // this.preview.done.subscribe( preview => {
        //     if ( ! this.post_title ) this.post_title = preview.title;
        // });
    }

    ngOnInit() { }

    setOptions(post, comment: COMMENT) {
        this.post = post;
        this.comment = comment;
        this.comment_content = comment.comment_content;
        this.files = Array.from(comment.files);
        this.preview.result = comment.site_preview;
        // console.log(comment);
    }



    onClickCancel() {
        this.activeModal.close(this.comment.comment_ID);
    }


    onClickSubmit() {
        let req: COMMENT_UPDATE = {
            comment_ID: this.comment.comment_ID,
            comment_content: this.comment_content,
            site_preview_id: this.preview.id
        };
        req.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        console.log(req);
        this.app.forum.commentUpdate(req).subscribe(id => {
            this.forumShare.updateComment( this.comment );
            this.activeModal.close(id);
        }, err => this.app.warning(err));
    }


}
