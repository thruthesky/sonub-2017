import { Component } from '@angular/core';

import { AppService } from "../../../../providers/app.service";
import {JOB, POST} from "../../../../providers/wordpress-api/interface";
import { ActivatedRoute, Router } from "@angular/router";



@Component({
    selector: 'job-view-page',
    templateUrl: 'job-view.html'
})

export class JobViewPage {

    profile: JOB;
    ID: number;


    today = new Date();
    currentYear = this.today.getFullYear();

    constructor(
        public app: AppService,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) {

        let params = activeRoute.snapshot.params;
        if (params['id']) {

            this.app.job.data({ route: 'wordpress.get_post', ID: params['id'] })
                .subscribe((job: JOB) => {
                    console.log('Profile:: ', job);
                    this.profile = job;
                }, e => this.app.warning(e));
        }

    }

    onClickEdit(ID) {
        this.router.navigate(['/job/edit', ID]);
    }

    onClickDelete(post: POST) {
        if (post.author.ID) {
            this.app.confirm(this.app.text('confirmDelete')).then(code => {
                if (code == 'yes') this.postDelete(post.ID);
            }, () => {});
        }
        else {
            let password = this.app.input('Input password');
            if (password) this.postDelete(post.ID, password);
        }
    }

    postDelete( ID, password?) {
        // debugger;
        this.app.forum.postDelete({ ID: ID, post_password: password }).subscribe(res => {
            console.log("file deleted: ", res);
            if (res.mode == 'delete') {
                this.router.navigateByUrl('/job');
            }
        }, err => this.app.warning(err));
    }

    urlPhoto(post) {
        let url = this.app.forum.getFirstImageThumbnailUrl(post);
        if (url) return url;
        else return this.app.anonymousPhotoURL;
    }

    getAge(birthday) {
        if (birthday && birthday.length > 4) {
            let year = parseInt(birthday.substring(0, 4));
            return this.currentYear - year;
        }
    }

}
