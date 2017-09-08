/**
 * @logic
 *          1. if 'post' is not set, then load one.
 */

import { Component, OnInit, Input } from '@angular/core';
import { AppService, POST, POSTS } from './../../providers/app.service';

@Component({
    selector: 'advertisement-sidebar-widget',
    templateUrl: 'advertisement-sidebar.html'
})
export class AdvertisementSidebarWdiget implements OnInit {

    @Input() post: POST;            // coming from advertisement list
    @Input() posts: POSTS;
    @Input() showMyMenu = false;

    @Input() id: string;

    constructor(
        public app: AppService
    ) {
        
    }

    ngOnInit() {
        if ( ! this.post ) this.loadAdvertisement(); // load avertisement if no post coming from list.
    }




  loadAdvertisement() {
    this.app.wp.post({ route: 'wordpress.get_advertisement', position: 'sidebar' })
      .subscribe((post: POST) => {
        // console.log('adv: ', post);
        this.post = post;
      }, e => console.error(e));
  }

    onClickDelete() {
        this.app.confirm({
            content: this.app.text('advertisement_delete'),
            buttons: [
                { class: 'class-yes', code: 'yes', text: this.app.text('yes') },
                { class: 'class-no', code: 'no', text: this.app.text('no') }
            ]
        })
            .then(code => {
                if ( code == 'yes' ) {
                    this.app.forum.postDelete( { ID: this.post.ID } )
                    .subscribe( re => {
                        console.log("post deleted");
                        let i = this.posts.findIndex( v => v.ID == re.ID );
                        this.posts.splice( i, 1 );
                    }, e => this.app.warning(e));
                }
            })
            .catch(res => console.log('dismissed'));
    }
}