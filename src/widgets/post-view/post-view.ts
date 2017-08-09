/**
 * Post View Widget is not only used in forum pages but also other pages.
 * So, it is not in forum pages folder.
 * 
 * When you need it, import it in that module and use it.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AppService, POST, PAGE } from './../../providers/app.service';
import { PostCreateEditModalService } from './../../modules/forum/modals/post-create-edit/post-create-edit.modal';
import { ForumCodeShareService } from '../../modules/forum/forum-code-share.service';


@Component({
    selector: 'post-view-widget',
    templateUrl: 'post-view.html'
})

export class PostViewWidget implements OnInit {

    @Input() post: POST;
    @Input() page: PAGE;
    constructor(
        public app: AppService,
        private postCreateEditModal: PostCreateEditModalService,
        private forumShare: ForumCodeShareService
    ) {
        
    }

    ngOnInit() {
        setTimeout( () => console.log('post view', this.post) , 1000);
        
    }

    onClickPostEdit(post) {

        this.postCreateEditModal.open({ post: post }).then(id => {
            console.log(id);
            this.forumShare.updatePost(post);
        }, err => console.error(err));

    }


}