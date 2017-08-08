import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';

@Component({
    selector: 'menu-page',
    templateUrl: 'menu.html'
})

export class MenuPage implements OnInit {
    constructor(
        public app: AppService
    ) {
        
    }

    ngOnInit() { }
}
