import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppService } from './../../../../providers/app.service';
import { CATEGORIES } from './../../../../providers/wordpress-api/interface';


@Component({
    selector: 'forum-index-page',
    templateUrl: 'index.html'
})

export class ForumIndexPage implements OnInit {
    categories: CATEGORIES = null;
    constructor(
        private http: HttpClient,
        private app: AppService
    ) {
        // this.app.file.uploadForm( {} ).subscribe( e => {
        //     console.log(e);
        // }, err => console.log( this.app.file.getErrorString(err) ) );
    }

    ngOnInit() {
        this.app.forum.getCategories().subscribe( categories => {
            // debugger
            this.categories = categories
        } );
    }


    onChangeFile(event) {

        this.app.file.uploadForm(event).subscribe(event => {
            if ( typeof event === 'number') {
                console.log(`File is ${event}% uploaded.`);
            }
            else if ( event.id !== void 0 ) {
                console.log('File is completely uploaded!');
                console.log(event);
            }
            else if ( event === null ) {
                console.log("what is it?");
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error occured.");
            } else {
                // console.log(err);
                if ( err.message == 'file_is_not_selected' || err.message == 'file_is_not_selected_or_file_does_not_exist' ) {
                    this.app.displayError('File uploaded cancelled. No file was selected.');
                }
                else this.app.displayError( 'File upload filed. Filesize is too large? ' + err.message );
            }
        } );

    }
}
