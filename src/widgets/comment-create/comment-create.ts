import {
    Component, OnInit, Input, Output, AfterViewInit, ViewChild, EventEmitter
} from '@angular/core';
import { AppService } from './../../providers/app.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import {
    POST, FILES,
    COMMENT, COMMENT_CREATE, COMMENT_CREATE_RESPONSE
} from './../../providers/wordpress-api/interface';

import { FileUploadWidget } from '../file-upload/file-upload';
import { AlertModalService } from './../../providers/modals/alert/alert.modal';

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


    /// site preview
    typing = new Subject<string>();
    sitePreviewUrl = '';
    preview;

    constructor(
        public app: AppService,
        private alert: AlertModalService
    ) {

    }

    get userPhotoURL() {

        if (this.app.user.isLogin && this.app.user.profile.photoURL) {
            return this.app.user.profile.photoURL;
        }
        else return null;
    }

    ngOnInit() {

        /// debounce 0.3s
        /// send to php the url only and if the url is on the beginning of the text.
        /// @todo since this code is reusable for post and comment, make it service.
        this.typing
            .debounceTime(300)
            .subscribe(text => {

                console.log('text: ', text);

                if (text.indexOf('http') === 0) {
                    let arr = text.split(/\s+/, 2);
                    if (arr && arr[0]) {
                        if ( this.sitePreviewUrl == arr[0] ) return;
                        this.sitePreviewUrl = arr[0];
                        console.log("sedning: ", this.sitePreviewUrl);
                        this.app.wp.post({ route: 'wordpress.site_preview', url: this.sitePreviewUrl })
                            .subscribe(res => {
                                this.sitePreviewUrl = '';
                                console.log("preview: ", res);
                                this.preview = res;
                            }, e => this.app.warning(e));
                    }
                }
            });

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


            this.resetForm();


            // this.app.user.activity( { action: 'comment-create', target: id } )
            //     .subscribe( res => console.log("activity: ", res), e => e ); // don't do for the result.



            this.create.emit(id);

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
