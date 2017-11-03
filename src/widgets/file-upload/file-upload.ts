import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


import { AppService } from './../../providers/app.service';
import {FILES, FILE, FILE_DELETE} from './../../providers/wordpress-api/interface';

import { Base } from './../../etc/base';

// import { environment } from './../../environments/environment';

declare var Camera;
declare var navigator;
declare var FileUploadOptions;
declare var FileTransfer;




@Component({
    selector: 'file-upload-widget',
    templateUrl: 'file-upload.html'
})

export class FileUploadWidget extends Base implements OnInit {
    url: string;// = environment.xapiUrl;
    progressPercentage = 0;
    @Input() files: FILES;
    @Input() post_password;
    @Input() title: boolean = true;
    @Input() fileSelectionButton: boolean = true;
    @Input() showUploadedFiles: boolean = true;
    @Output() success = new EventEmitter<any>();

    @Input() titleText = 'File Upload';
    constructor(
        public app: AppService
    ) {

        super();
        this.url = this.xapiUrl();
        document.addEventListener('deviceready', () => this.onDeviceReady(), false);

    }

    onDeviceReady() {
        console.log("Cordova is ready.");
    }

    ngOnInit() {
        ///
        if (!this.files) alert(`[files] property for binding is not initialized on template.`);
    }

    onClickCamera() {
        if (!this.app.isCordova) return;

        this.confirmCameraAction().then(code => this.takePhoto(code));

    }

    takePhoto(code) {
        let type = null;

        if (code == 'camera') {
            // get the picture from camera.
            type = Camera.PictureSourceType.CAMERA;
        }
        else if (code == 'gallery') {
            // get the picture from library.
            type = Camera.PictureSourceType.PHOTOLIBRARY
        }
        else return;

        console.log("in cordova, type: ", type);

        let options = {
            quality: 90,
            sourceType: type
        };
        navigator.camera.getPicture(path => {
            console.log('photo: ', path);
            // alert(path);
            // transfer the photo to the server.
            this.cordovaTransferFile(path);
        }, e => {
            console.error('camera error: ', e);
            alert("camera error");
        }, options);
    }

    confirmCameraAction() {

        return this.app.confirm({
            title: 'Photo Upload',
            content: 'Where do you want to get photo from?',
            buttons: [
                { class: 'a', code: 'camera', text: 'Camera' },
                { class: 'b', code: 'gallery', text: 'Gallery' },
                { class: 'c', code: 'cancel', text: 'Cancel' }
            ]
        })
            .catch(res => console.log('dismissed'));


    }

    cordovaTransferFile(filePath: string) {
        var options = new FileUploadOptions();
        options.fileKey = "userfile";
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1) + '.jpg';
        options.mimeType = "image/jpeg";
        var params = { route: 'file.upload', session_id: this.app.user.sessionId };
        options.params = params;


        var ft = new FileTransfer();

        let percentage = 0;
        ft.onprogress = progressEvent => {
            // @todo This is not working....
            if (progressEvent.lengthComputable) {
                try {
                    percentage = Math.round(progressEvent.loaded / progressEvent.total * 100);
                }
                catch (e) {
                    // console.error( 'percentage computation error' );
                    percentage = 10;
                }
            }
            else percentage = 10; // progressive does not work. it is not computable.
            // console.log('percentage: ', percentage);
            this.onProgress(percentage);
        };

        let uri = encodeURI(this.url);

        console.log(filePath);
        console.log(uri);
        console.log(options);

        ft.upload(filePath, uri, r => {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
            let re;
            try {
                re = JSON.parse(r.response);
            }
            catch (e) {
                this.app.warning("JSON parse error on server response while file transfer...");
                return;
            }

            if ( re['code'] == 0 ) {
                this.insertFile(re['data']);
            }
            else this.app.warning( re );


        }, e => {
            console.log("upload error source " + e.source);
            console.log("upload error target " + e.target);
            this.app.warning(e.code);
            this.onUploadFailure();
        }, options);
    }

    onChangeFile(event) {
        if (this.app.isCordova) return;
        this.app.file.uploadForm(event).subscribe(event => {
            // console.log(event);
            if (typeof event === 'number') {
                // console.log(`File is ${event}% uploaded.`);
                this.onProgress(event);
            }
            else if (event.id !== void 0) {
                // console.log('File is completely uploaded!');
                // console.log(event);
                this.insertFile(event);
            }
            else if (event === null) {
                console.log("what is it?");
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error occured.");
            } else {
                console.log(err);
                if (err.message == 'file_is_not_selected' || err.message == 'file_is_not_selected_or_file_does_not_exist') {
                    this.app.warning('File uploaded cancelled. No file was selected.');
                }
                else this.app.warning('File upload filed. Filesize is too large? ' + err.message);
            }
            this.onUploadFailure();
        });
    }

    onClickDeleteButton(file) {
        this.deleteFile(file);
    }

    deleteFile(file: FILE) {
        let data: FILE_DELETE = {};

        data.id = file.id;
        data.post_password = this.post_password;

        this.app.file.delete(data).subscribe(id => {
            console.log("file deleted: ", id);
            // this.files = this.files.filter( file => file.id != id ); //
            let index = this.files.findIndex(file => file.id == id);
            this.files.splice(index, 1);
            console.log('onClickDeleteButton::',this.files);
            this.app.rerenderPage();
        }, err => this.app.warning(err));
    }

    onProgress(p: number) {
        this.progressPercentage = p;
        this.app.rerenderPage();
    }

    insertFile(file) {
        this.files.push(file);
        console.log("this.files: ", this.files);
        this.progressPercentage = 0;
        this.success.emit(file);
        this.app.rerenderPage();
    }

    onUploadFailure() {
        this.progressPercentage = 0;
    }
}
