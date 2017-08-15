import { Injectable } from '@angular/core';
import { Base } from './../../etc/base';
import { UserService } from './user.service';
import { WordpressApiService } from './wordpress-api.service';
import { JOB_CREATE, JOB, JOBS, POST_CREATE, POSTS, POST, POST_QUERY_RESPONSE, JOB_PAGE } from './interface';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class JobService extends Base {

    constructor(
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }
    create(data: JOB_CREATE): Observable<JOB> {
        let req: POST_CREATE = this.convertCreate(data);
        // console.log('convertedCreate', req);
        return this.wp.post(req);
    }

    convertCreate(data: JOB_CREATE): POST_CREATE {

        let title = `${data.first_name} is a ${data.profession} from ${data.city ? data.city : data.province} looking for a job` ;

        let req: POST_CREATE = {
            category: 'jobs',
            post_title: title,
            post_content: data.message,
            fid: data.fid
        };


        req['first_name'] = data.first_name;
        req['middle_name'] = data.middle_name;
        req['last_name'] = data.last_name;
        req['mobile'] = data.mobile;
        req['address'] = data.address;

        req.varchar_1 = data.city;
        req.varchar_2 = data.province;
        req.varchar_4 = data.profession;
        req.varchar_5 = data.first_name + ' ' + data.middle_name + ' ' + data.last_name;


        req.int_1 = data.experience;
        req.int_2 = data.birthday;
        req.char_1 = data.gender;
        req.post_password = data.password;
        req.session_id = this.user.sessionId;
        req.route = 'post.create';
        return req;
    }


    // list(req): Observable<JOBS> {
    //     return this.wp.query(req)
    //         .map(e => this.convertPage(e))
    // }

    search(req): Observable<JOB_PAGE> {
        let str = JSON.stringify(req);
        str = str.replace('gender', 'char_1');
        str = str.replace('experience', 'int_1');
        str = str.replace('birthday', 'int_2');
        str = str.replace('city', 'varchar_1');
        str = str.replace('province', 'varchar_2');
        str = str.replace('profession', 'varchar_4');
        str = str.replace('fullname', 'varchar_5');
        req = JSON.parse(str);

        if ( req['query'] === void 0 ) req['query'] = {};
        req['query']['slug'] = "jobs";
        req['route'] = "wordpress.post_query";

        console.log("job search request: ", req);
        return this.wp.post(req)
            .map(e => this.convertPage(e));
    }

    convertPage(page: POST_QUERY_RESPONSE): JOB_PAGE {

        console.log('convertPage: ', page);
        if ( page.posts && page.posts.length) {
            for (let post of page.posts) {
                post['first_name'] = post.meta['first_name'];
                post['middle_name'] = post.meta['middle_name'];
                post['last_name'] = post.meta['last_name'];
                post['address'] = post.meta['address'];
                post['mobile'] = post.meta['mobile'];
                post['city'] = post.varchar_1;
                post['province'] = post.varchar_2;
                post['profession'] = post.varchar_4;
                post['fullname'] = post.varchar_5;
                post['experience'] = post.int_1 < 12 ? post.int_1 + ' months' : post.int_1/12 + ' years';
                post['birthday'] = post.int_2;
                post['gender'] = post.char_1;
                post['timestamp_create'] = post.meta['timestamp_create'];
                post['message'] = post.post_content;

                delete post.post_title;
                delete post.post_content;
                delete post.post_parent;
                delete post.post_date;
                delete post.varchar_1;
                delete post.comment_count;
                delete post.comments;
                delete post.meta;

                delete post.int_1;
                delete post.int_2;
                delete post.int_3;
                delete post.char_1;
                delete post.char_2;
                delete post.char_3;
                delete post.varchar_1;
                delete post.varchar_2;
                delete post.varchar_3;
                delete post.varchar_4;
                delete post.varchar_5;

            }
        }

        // console.log('Converted Page:: ', page);
        return <any>page;
    }

}
