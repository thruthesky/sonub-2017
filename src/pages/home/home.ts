import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { TestService } from './../../providers/test.service';


declare let device;


@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})

export class HomePage implements OnInit {
    device = {};
    constructor(
        public app: AppService,
        // private test: TestService
    ) {
        document.addEventListener('deviceready', () => this.onDeviceReady(), false);
    }

    ngOnInit() { }

    onDeviceReady() {
        this.device = device;
        console.log("Cordova is ready.");
        console.log(device.cordova);
        console.log(device.version);
        console.log(device.model);
    }




}