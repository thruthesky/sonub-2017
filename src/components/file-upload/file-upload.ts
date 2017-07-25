import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


import { AppService } from './../../providers/app.service';
import { FILES, FILE } from './../../providers/wordpress-api/interface';

@Component({
    selector: 'file-upload-component',
    templateUrl: 'file-upload.html'
})

export class FileUploadComponent implements OnInit {
    url: string = '';
    files: FILES = [];
    constructor(
        public app: AppService
    ) {

    }

    ngOnInit() { }

    onChangeFile( event ) {

        
        this.app.file.uploadForm(event).subscribe(event => {
            if ( typeof event === 'number') {
                console.log(`File is ${event}% uploaded.`);
            }
            else if ( event.id !== void 0 ) {
                console.log('File is completely uploaded!');
                console.log(event);
                this.files.push( event );
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

    onClickDeletePhoto(image) {

    }

    getFileType(file: FILE ) {
        if ( typeof file.type === 'string' ) return file.type.indexOf('image/') == -1 ? 'attachment': 'image';
        else return 'attachment';
    }
}