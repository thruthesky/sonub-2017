import { Component, OnInit, Input, Output, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE
} from './../../../../providers/wordpress-api/interface';

import { FileUploadComponent } from './../../../../components/file-upload/file-upload';


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
        private app: AppService
    ) {

    }

    ngOnInit() { }

    ngAfterViewInit() {
        // setTimeout( () => this.checkCommentComment(), 10 );
    }

    // checkCommentComment() {
        
    // }

    onSubmit() {

        console.log(this.comment_content);


        let req: COMMENT_CREATE = {
            comment_post_ID: this.post.ID,
            comment_content: this.comment_content
        };

        req.fid = this.files.reduce( (_, file) => { _.push(file.id) ; return _; }, [] );

        if ( this.comment && this.comment.comment_ID ) req.comment_parent = this.comment.comment_ID;
        this.app.forum.commentCreate( req ).subscribe( (id: COMMENT_CREATE_RESPONSE) => {
            console.log("comment created", id);
            this.create.emit( id );
        }, err => this.app.warning(err) );


    }

    
}