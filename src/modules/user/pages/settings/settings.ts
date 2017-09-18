import { Component, OnInit } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'settings-page',
    templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
    text: any = {};
    constructor(
        public app: AppService
    ) {
        app.wp.text(['setting', 'setting_desc'], re => this.text = re);
    }

    ngOnInit() { }

    onClickLanguage( ln ) {
        this.app.setLanguage( ln );
    }
}