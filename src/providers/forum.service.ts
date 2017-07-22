import { Injectable } from '@angular/core';
import { Base } from '../etc/base';
import { ERROR } from '../etc/define';
import { WordpressApiService } from './wordpress-api.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';



import { REQUEST } from './../etc/interface';


export interface POST_COMMON {
    post_title: string;
    post_content?: string;
};

export interface POST_CREATE extends POST_COMMON {
    category: string;
};


export interface POST_UPDATE extends POST_COMMON {
    category: string;
    ID: number;
};



@Injectable()
export class ForumService extends Base {

    
    constructor(
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }



    postCreate( data ): Observable<number> {
        data['session_id'] = this.user.userProfile.session_id;
        console.log(data);
        return this.wp.postCreate( data );
    }
    postData( data ) {
    }
    
    postUpdate( data ): Observable<number> {
        data['session_id'] = this.user.userProfile.session_id;
        return this.wp.postUpdate( data );
    }

    postDelete() {

    }

    commentCreate() {

    }
    commentData() {

    }
    commentUpdate() {

    }
    commentDelete() {

    }

    page() {
        
    }
}
