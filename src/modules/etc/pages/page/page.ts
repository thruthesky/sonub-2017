import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'page-page',
    templateUrl: 'page.html'
})

export class PagePage implements OnInit {
    html = '';
    doneListen = false;
    constructor(
        public app: AppService
    ) {
        this.html = '';
        this.doneListen = false;
        app.section('forum');
        app.wp.page('forum-index').subscribe(html => {
            console.log("page: ", html);
            this.html = html;
            setTimeout(() => this.listenUrlClick(), 0);
        }, e => app.warning({ code: -404 }));

    }

    ngOnInit() {
        
    }

    listenUrlClick() {

        let nodes:NodeList = document.querySelectorAll('.page-body-content-layout > .b [routerLink]');
        let links: Array<Node> = Array.from( nodes );
        console.log("links: ", links);


        links.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                let url = e.srcElement.getAttribute('routerLink');
                console.log( url );
                this.app.go( url );
            });

        });

    }


    
}
