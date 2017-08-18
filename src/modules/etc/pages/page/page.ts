import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from './../../../../providers/app.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'page-page',
    templateUrl: 'page.html'
})
export class PagePage implements OnInit, OnDestroy {
    html = '';
    links: Array<Node> = [];
    constructor(
        private active: ActivatedRoute,
        private router: Router,
        public app: AppService
    ) {

        let pageData;
        active.data.subscribe(data => {
            if ( ! data || ! data['filename'] ) return;
            this.loadPage(data);
            pageData = data;
        });
        active.params.subscribe(params => {
            if ( params['name'] === void 0 ) return;
            pageData = {
                section: '',
                layout: 'two-column',
                filename: params['name']
            };
        });

        /// remove this after test.
        // if ( environment.production === false ) setInterval( () => this.loadPage( pageData ), 2000 );
    }
    loadPage(data) {
        console.log('data: ', data);
        this.app.section(data['section']);
        this.app.pageLayout = data['layout'];
        if ( environment.production ) this.html = '';
        this.app.wp.page(data['filename']).subscribe(html => {
            this.html = html;
            setTimeout(() => this.listenUrlClick(), 0);
        }, e => this.app.warning({ code: -404 }));

    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.app.layoutColumn();
        this.removeRouteClickEvent();
    }
    listenUrlClick() {
        this.removeRouteClickEvent();
        let nodes: NodeList = document.querySelectorAll('.page-body-content-layout > .b [routerLink]');
        this.links = Array.from(nodes);
        console.log("links: ", this.links);
        this.links.forEach(link => {
            link.addEventListener('click', e => this.addRouteClickEvent(e));
        });
    }
    addRouteClickEvent(e) {
        e.preventDefault();
        let url = e.srcElement.getAttribute('routerLink');
        console.log("click on url: ", url);
        this.router.navigateByUrl(url);
    }
    removeRouteClickEvent() {
        if (this.links && this.links.length) {
            this.links.forEach(link => {
                link.removeEventListener('click', e => this.addRouteClickEvent(e));
            });
        }
    }
}
