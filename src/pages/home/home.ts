import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { TestService } from './../../providers/test.service';
import { Router } from '@angular/router';



declare let device;


@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})

export class HomePage implements OnInit, AfterViewInit {
    device = {};
    constructor(
        private router: Router,
        public app: AppService,
        // private test: TestService
    ) {
        document.addEventListener('deviceready', () => this.onDeviceReady(), false);
    }

    ngOnInit() { }

    ngAfterViewInit() {


        this.router.navigateByUrl('/forum/abc');
    }

    onDeviceReady() {
        this.device = device;
        console.log("Cordova is ready.");
        console.log(device.cordova);
        console.log(device.version);
        console.log(device.model);
    }




}