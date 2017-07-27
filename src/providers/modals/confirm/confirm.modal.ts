import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmContent } from './confirm.content'


@Injectable()
export class ConfirmModalService {

    modalRef: NgbModalRef = null;
    constructor(
        private modalService: NgbModal
    ) {

    }

    open( options ): Promise<any> {
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(ConfirmContent, { windowClass: 'confirm-modal', backdrop: 'static' });

        this.modalRef.componentInstance.setOptions( options );

        return this.modalRef.result;
    }


}