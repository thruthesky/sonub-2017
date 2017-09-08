import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService, POST, FILES, FILE, POST_CREATE } from './../../../../providers/app.service';


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
    ID; // for update only.
    // post: POST;

    text: any = {}; /// text

    constructor(
        private activeRoute: ActivatedRoute,
        public app: AppService
    ) {
        app.pageLayout = 'wide';
        console.log("cons");

        let codes = [
            'advertisement',
            'advertisement_desc',
            'my_advertisement_list',
            'advertisement_position',
            'preview',
            'input_advertisement_title',
            'input_advertisement_summary'
        ];
        app.wp.text(codes, re => this.text = re);

        let params = activeRoute.snapshot.params;
        if (params['id']) {
            this.app.wp.post({ route: 'wordpress.get_advertisement_by_id', ID: params['id'] })
                .subscribe((post: POST) => {
                    console.log('adv: ', post);
                    // this.post = post;

                    this.ID = post.ID;
                    this.title = post.post_title;
                    this.summary = post.post_content;
                    this.domain = post.varchar_2;
                    this.url = post.varchar_4;
                    this.display = post.char_1;
                    this.position = post.varchar_1;
                    if (post.files.length) {
                        this.files[0] = post.files[0];
                        this.file = post.files[0];
                    }
                }, e => this.app.warning(e));
        }
    }

    ngOnInit() { }

    ngOnDestroy() {
        // console.log("des");
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
        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);
        data['ID'] = this.ID;
        this.app.forum.postCreate(data).subscribe(res => {
            console.log("Post create: ", res);
            this.app.alert.open({ content: this.app.text('saved') });
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