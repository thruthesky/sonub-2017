import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'alert-content',
    templateUrl: 'alert.content.html'
})

export class AlertContent implements OnInit {
    options = {
        title: '',
        content: '',
        button: ''
    };
    constructor(
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit() {
    }



    setOptions(options) {
        this.options = options;
    }
}