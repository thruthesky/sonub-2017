import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirm-content',
    templateUrl: 'confirm.content.html'
})

export class ConfirmContent implements OnInit {

    options;
    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() { }

    setOptions( options ) {
        this.options = options;
    }
}