import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PostCreateContent } from './post-create.content';

@Injectable()
export class PostCreateModalService {


    modalRef = null;
    constructor(
        private modalService: NgbModal
    ) {

    }

    open(): Promise<any> {
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(PostCreateContent, { windowClass: 'post-create-modal', backdrop: 'static' });

        // this.modalRef.componentInstance['successCallback'] = successCallback;
        // this.modalRef.componentInstance['failureCallback'] = failureCallback;

        return this.modalRef.result;
    }


}