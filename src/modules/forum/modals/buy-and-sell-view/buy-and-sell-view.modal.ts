import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BuyAndSellViewContent } from './buy-and-sell-view.content';


import {BUYANDSELL} from "../../../../providers/wordpress-api/interface";




@Injectable()
export class BuyAndSellViewModalService {

    modalRef = null;
    constructor(
        private modalService: NgbModal
    ) {

    }

    open(product: BUYANDSELL): Promise<any> {

        console.log('OpenModalView::', product);
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(BuyAndSellViewContent, { windowClass: 'buy-and-sell-modal', backdrop: true, size: 'lg' });
        this.modalRef.componentInstance.setOptions( product );
        return this.modalRef.result;
    }

}



