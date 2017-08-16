import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'forum-index-page',
    templateUrl: 'index.html'
})

export class ForumIndexPage implements OnInit {
    html = '';
    constructor(
        public app: AppService
    ) {
        app.section('forum');

        app.wp.page('forum-index').subscribe(html => {
            console.log("page: ", html);
            this.html = html;
        }, e => app.warning({ code: -404 }));


        // this.app.file.uploadForm( {} ).subscribe( e => {
        //     console.log(e);
        // }, err => console.log( this.app.file.getErrorString(err) ) );
    }

    ngOnInit() {
        // this.app.forum.getCategories().subscribe(categories => {
        //     this.categories = categories;
        // }, e => this.app.warning(e));
    }


    // onChangeFile(event) {

    //     this.app.file.uploadForm(event).subscribe(event => {
    //         if (typeof event === 'number') {
    //             console.log(`File is ${event}% uploaded.`);
    //         }
    //         else if (event.id !== void 0) {
    //             console.log('File is completely uploaded!');
    //             console.log(event);
    //         }
    //         else if (event === null) {
    //             console.log("what is it?");
    //         }
    //     }, (err: HttpErrorResponse) => {
    //         if (err.error instanceof Error) {
    //             console.log("Client-side error occured.");
    //         } else {
    //             // console.log(err);
    //             if (err.message == 'file_is_not_selected' || err.message == 'file_is_not_selected_or_file_does_not_exist') {
    //                 this.app.displayError('File uploaded cancelled. No file was selected.');
    //             }
    //             else this.app.displayError('File upload filed. Filesize is too large? ' + err.message);
    //         }
    //     });

    // }
}
