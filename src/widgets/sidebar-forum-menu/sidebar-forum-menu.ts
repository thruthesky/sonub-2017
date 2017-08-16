import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
@Component({
    selector: 'sidebar-forum-menu-widget',
    templateUrl: 'sidebar-forum-menu.html'
})

export class SidebarForumMenuWidget implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}