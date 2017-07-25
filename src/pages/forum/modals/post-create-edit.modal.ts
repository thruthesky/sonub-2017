import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PostCreateEditContent, OPTIONS } from './post-create-edit.content';
export { OPTIONS } from './post-create-edit.content';

@Injectable()
export class PostCreateEditModalService {


    modalRef = null;
    constructor(
        private modalService: NgbModal
    ) {

    }

    open( options: OPTIONS ): Promise<any> {
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(PostCreateEditContent, { windowClass: 'post-create-modal', backdrop: 'static' });

        this.modalRef.componentInstance.setOptions( options );
        // this.modalRef.componentInstance['failureCallback'] = failureCallback;

        return this.modalRef.result;
    }


}