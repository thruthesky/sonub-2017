import {Component, OnInit} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppService} from "../../../../providers/app.service";
import {BUYANDSELL} from "../../../../providers/wordpress-api/interface";
import {Router} from "@angular/router";



@Component({
    selector: 'buy-and-sell-view.content',
    templateUrl: 'buy-and-sell-view.content.html'
})

export class BuyAndSellViewContent implements OnInit {

    product: BUYANDSELL;
    selectedImage: string;


    constructor(
        public activeModal: NgbActiveModal,
        public app: AppService,
        private router: Router
    ) {

    }


    ngOnInit() { }

    setOptions( product) {
        this.product = product;
        if(product.files.length) this.selectedImage = product.files[0].url;
    }


    onClickCancel() {
        this.activeModal.close();
    }

    onClickUpdate(ID) {
        this.router.navigateByUrl('/buyandsell/edit/', ID);
        this.activeModal.close();
    }



}
