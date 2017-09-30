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

    @Input() post: POST; // = { ID: 0, author: {}, comment_count: 0, comments: [], guid: '', post_date: '', post_parent: 0, meta: [], count_images: 0, count_files: 0, post_title: 'Loading', post_content: 'Loading', files: [] };
    @Input() page: PAGE;


    // filePosition = 'bottom';

    constructor(
        public app: AppService,
        private postCreateEditModal: PostCreateEditModalService,
        private forumShare: ForumCodeShareService
    ) {

    }

    ngOnInit() {
        // setTimeout( () => this.setFilePosition(), 1 );
        // setTimeout( () => console.log('post view', this.post) , 1000);
    }

    onClickPostEdit(post) {
        this.postCreateEditModal.open({ post: post }).then(id => {
            console.log(id);
            this.forumShare.updatePost(post);
        }, err => {
            console.log(err);
        });
    }

    onCommentCreate(comment_ID, post: POST) {
        // console.log(`ForumListPage::onCommentCreate()  : ${comment_ID}`);
    }



    onClickPostDelete(post: POST, page: PAGE) {

        if (post.author.ID) {
            this.app.confirm(this.app.text('confirmDelete')).then(code => {
                if (code == 'yes') this.postDelete(page, post.ID);
            }, () => {});
        }
        else {
            let password = this.app.input('Input password');
            if (password) this.postDelete(page, post.ID, password);
        }
    }

    postDelete(page, ID, password?) {
        // debugger;
        this.app.forum.postDelete({ ID: ID, post_password: password }).subscribe(res => {
            console.log("file deleted: ", res);

            let index = page.posts.findIndex(post => post.ID == res.ID);
            if (res.mode == 'delete') {
                page.posts.splice(index, 1);
            }
            else this.forumShare.updatePost(page.posts[index]);


        }, err => this.app.warning(err));
    }

    get filePosition() {
        if ( this.post && this.post.category_option && this.post.category_option['file-position'] ) {
            return this.post.category_option['file-position'];
        }
        if ( this.page && this.page.category_option && this.page.category_option['file-position'] ) {
            return this.page.category_option['file-position'];
        }
        return 'bottom';
    }


    onClickLike( post: POST, choice: 'like' | 'dislike' ) {
        if ( this.app.user.isLogout ) return this.app.warning( this.app.e.LOGIN_FIRST );
        this.app.wp.post({route: 'wordpress.post_like', choice: choice, ID: post.ID, session_id: this.app.user.sessionId})
            .subscribe( re => {
                console.log("like: ", re);
                this.post.meta['like'] = re['like'];
                this.post.meta['dislike'] = re['dislike'];
            }, e => this.app.warning(e));
    }
}
