import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';



import { environment } from './../../environments/environment';



import { Base } from './../../etc/base';

import { WordpressApiService } from './wordpress-api.service';
import { UserService } from './user.service';

import { FILE } from './interface';



@Injectable()
export class FileService extends Base {


    private url: string = environment.xapiUrl;
    constructor(
        private http: HttpClient,
        private wp: WordpressApiService,
        private user: UserService
    ) {
        super();
    }


    uploadForm(event): Observable<any> {
        if (event === void 0 || event.target === void 0 || event.target.files === void 0) {
            return Observable.throw(new Error('file_is_not_selected'));
        }
        let files = event.target.files;
        if (files === void 0 || files[0] == void 0 || !files[0]) {
            return Observable.throw(new Error('file_is_not_selected_or_file_does_not_exist'));
        }
        let file = files[0];

        let formData = new FormData();
        formData.append('userfile', file, file.name);
        formData.append('route', 'file.upload');

        let req = new HttpRequest('POST', this.url, formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this.http.request(req)
            .map(e => {
                if (e instanceof HttpResponse) { // success event.
                    if ( e.status == 200 ) {
                        if ( e.body ) return e.body;
                        else return {};
                    }
                }
                else if ( e instanceof HttpHeaderResponse ) { // header event
                    return {};
                }
                else if (e.type === HttpEventType.UploadProgress) { // progress event
                    return Math.round(100 * e.loaded / e.total);
                }
                return e; // other events
            });

    }

    
    delete(id: number): Observable<number> {
        let req = {
            route: 'wordpress.delete_attachment',
            session_id: this.user.sessionId,
            id: id
        };
        return this.wp.post(req);
    }
    


    getFileType(file: FILE ) {
        if ( typeof file.type === 'string' ) return file.type.indexOf('image/') == -1 ? 'attachment': 'image';
        else return 'attachment';
    }


}