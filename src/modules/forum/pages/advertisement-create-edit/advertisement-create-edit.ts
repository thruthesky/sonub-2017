import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
import {
    POST_CREATE,
    FILES, FILE
} from './../../../../providers/wordpress-api/interface';

@Component({
    selector: 'advertisement-create-edit-page',
    templateUrl: 'advertisement-create-edit.html'
})

export class AdvertisementCreateEditPage implements OnInit, OnDestroy {
    title;
    summary;
    domain;
    url;
    display;
    position;
    files: FILES = [];
    file: FILE;
    constructor(
        public app: AppService
    ) {
        app.pageLayout = 'wide';
        console.log("cons");
    }

    ngOnInit() { }

    ngOnDestroy() {
        console.log("des");
        this.app.pageLayout = 'column';
    }



    onClickSubmit() {

        let data: POST_CREATE = {
            category: 'advertisement',
            post_title: this.title,
            post_content: this.summary,
            char_1: this.display,
            varchar_1: this.position,
            varchar_2: this.domain,
            varchar_4: this.url
        };
        data.fid = this.files.reduce( (_, file) => { _.push(file.id) ; return _; }, [] );
        this.app.forum.postCreate(data).subscribe(res => {
            console.log("Post create: ", res);
        }, e => this.app.warning(e));

    }

    onSuccessUploadAdvertisementImage(file: FILE) {

        if (this.files.length > 1) { /// if there are more than 1 files ( 2 files are uploaded.)
            let prev = this.files.shift(); /// then get first one
            this.app.file.delete({ id: prev.id }).subscribe(id => { /// delete that.
                console.log("file deleted: ", id);
            }, e => this.app.warning(e));
        }

    }
}