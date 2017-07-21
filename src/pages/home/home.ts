import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from './../../providers/wordpress-api';


@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})

export class HomePage implements OnInit {
    constructor(
        wp: WordpressApiService
    ) {
        wp.getPosts().subscribe( data => console.log(data) );
    }

    ngOnInit() { }
}