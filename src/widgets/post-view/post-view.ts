/**
 * Post View Widget is not only used in forum pages but also other pages.
 * So, it is not in forum pages folder.
 * 
 * When you need it, import it in that module and use it.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { POST } from './../../providers/wordpress-api/interface';


@Component({
    selector: 'post-view-widget',
    templateUrl: 'post-view.html'
})

export class PostViewWidget implements OnInit {

    @Input() post: POST;
    constructor(
        public app: AppService
    ) {
        
    }

    ngOnInit() {
        setTimeout( () => console.log('post view', this.post) , 1000);
        
    }
}