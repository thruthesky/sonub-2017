import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


interface BUTTON {
    class?: string;
    code: string;
    text: string;
}
export interface CONFIRM_OPTIONS {
    title?: string;
    content: string;
    buttons: Array<BUTTON>;
};


@Component({
    selector: 'confirm-content',
    templateUrl: 'confirm.content.html'
})

export class ConfirmContent implements OnInit {

    options: CONFIRM_OPTIONS;
    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() { }

    setOptions( options ) {
        this.options = options;
    }
}