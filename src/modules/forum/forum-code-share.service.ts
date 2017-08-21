import { Injectable } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { POST, COMMENT } from './../../providers/wordpress-api/interface';


@Injectable()
export class ForumCodeShareService {

    constructor(
        private app: AppService
    ) { }



    /**
     * 
     * @param oComment is the original reference of the comment in the template. 
     */
    updateComment( oComment: COMMENT ) {
        this.app.forum.commentData(oComment.comment_ID).subscribe((comment: COMMENT) => {
            let depth = oComment.depth;
            Object.assign( oComment, comment );
            oComment.depth = depth;
            console.log('commentData: ', comment);
            console.log( oComment );
        }, e => this.app.warning(e));
    }


    updatePost(post: POST) {
        this.app.forum.postData(post.ID).subscribe(postData => {
            console.log("post updated: ", postData);
            Object.assign(post, postData);
            this.app.forum.pre( post );
        }, e => this.app.warning(e));
    }


}