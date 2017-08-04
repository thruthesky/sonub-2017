import {
    Component, OnInit, Input, Output, AfterViewInit, ViewChild, EventEmitter
} from '@angular/core';
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

    ngOnInit() {

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
            comment_content: this.comment_content
        };

        req.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        if (this.comment && this.comment.comment_ID) req.comment_parent = this.comment.comment_ID;
        this.app.forum.commentCreate(req).subscribe((re: COMMENT_CREATE_RESPONSE) => {
            let id = re.comment_ID;
            console.log("comment created", re);
            this.insertComment(id);
            // this.app.wp.post({route: 'wordpress.comment_push_message', comment_ID: id}).subscribe( res => {
            //     console.log('push', res);
            // }, err => this.app.warning(err) );
            this.create.emit(id);


            // this.sendMessage(re);
            this.resetForm();
        }, err => {
            this.app.warning(err);
            // this.alert.open("error !!");
        });


    }

    resetForm() {
        this.files = [];
        this.comment_content = '';
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
            if( ! this.post.comments ) this.post['comments'] = [];

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
