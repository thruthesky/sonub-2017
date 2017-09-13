import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { text } from './../../../etc/text';



@Component({
    selector: 'alert-content',
    templateUrl: 'alert.content.html'
})

export class AlertContent implements OnInit {
    options = {
        title: '',
        content: '',
        bottom: '',
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
        if ( ! this.options.button ) {
            this.options.button = text('ok');
        }
    }
}