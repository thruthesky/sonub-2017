import { Component, OnInit, Input } from '@angular/core';
import { AppService, POST, POSTS } from './../../providers/app.service';

@Component({
    selector: 'advertisement-sidebar-widget',
    templateUrl: 'advertisement-sidebar.html'
})
export class AdvertisementSidebarWdiget implements OnInit {

    @Input() post: POST;
    @Input() posts: POSTS;
    @Input() showMenu = false;

    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }

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