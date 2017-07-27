import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'confirm-content',
    templateUrl: 'confirm.html'
})

export class ConfirmContent implements OnInit {

    options;
    constructor() { }

    ngOnInit() { }

    setOptions( options ) {
        this.options = options;
    }
}