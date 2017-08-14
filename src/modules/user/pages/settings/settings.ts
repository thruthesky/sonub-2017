import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'settings-page',
    templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }

    onClickLanguage( ln ) {
        this.app.setLanguage( ln );
    }
}