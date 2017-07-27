import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


import { AppService } from './../../providers/app.service';
import { FILES, FILE } from './../../providers/wordpress-api/interface';


declare var Camera;
declare var device;


@Component({
    selector: 'file-upload-component',
    templateUrl: 'file-upload.html'
})

export class FileUploadComponent implements OnInit {
    device;
    url: string = '';
    @Input() files: FILES;
    @Input() post_password;
    @Input() title: boolean = true;
    @Input() fileSelectionButton: boolean = true;
    constructor(
        public app: AppService
    ) {

        document.addEventListener('deviceready', () => this.onDeviceReady(), false);

    }


    onDeviceReady() {
        this.device = device;
        console.log("Cordova is ready.");
        console.log(device.cordova);
        console.log(device.version);
        console.log(device.model);
    }


    ngOnInit() {
        /// 
        if (!this.files) this.app.warning("ERROR: files property is not initialized.");
    }

    onClickCamera() {
        if (!this.app.isCordova) return;

        // let type = null;
        // let re = confirm("Click 'YES' to take photo. Click 'NO' to get photo from library.");
        // if (re) {
        //     // get the picture from camera.
        //     type = Camera.PictureSourceType.CAMERA;
        // }
        // else {
        //     // get the picture from library.
        //     type = Camera.PictureSourceType.PHOTOLIBRARY
        // }

        // console.log("in cordova, type: ", type);

        // let options = {
        //     quality: 60,
        //     sourceType: type
        // };
        // navigator.camera.getPicture(path => {
        //     console.log('photo: ', path);
        //     // transfer the photo to the server.
        // }, e => {
        //     console.error('camera error: ', e);
        //     alert("camera error");
        // }, options);
    }



    onChangeFile(event) {
        if (this.app.isCordova) return;
        this.app.file.uploadForm(event).subscribe(event => {
            if (typeof event === 'number') {
                console.log(`File is ${event}% uploaded.`);
            }
            else if (event.id !== void 0) {
                console.log('File is completely uploaded!');
                console.log(event);
                this.files.push(event);
            }
            else if (event === null) {
                console.log("what is it?");
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error occured.");
            } else {
                // console.log(err);
                if (err.message == 'file_is_not_selected' || err.message == 'file_is_not_selected_or_file_does_not_exist') {
                    this.app.displayError('File uploaded cancelled. No file was selected.');
                }
                else this.app.displayError('File upload filed. Filesize is too large? ' + err.message);
            }
        });
    }


    onClickDeleteButton(file) {
        this.app.file.delete({ id: file.id, post_password: this.post_password }).subscribe(id => {
            console.log("file deleted: ", id);
            // this.files = this.files.filter( file => file.id != id ); //
            let index = this.files.findIndex(file => file.id == id);
            this.files.splice(index, 1);
            console.log(this.files);

        }, err => this.app.displayError(err));
    }
}