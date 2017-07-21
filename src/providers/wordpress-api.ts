import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class WordpressApiService {

    constructor(
        private http: HttpClient
    ) {
    }

    getPosts() {
        return this.http.get('http://sonub.com/wp-json/wp/v2/posts');
    }
}
