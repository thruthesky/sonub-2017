import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommentEditContent } from './comment-edit.content';
import { AppService } from './../../../../providers/app.service';


import {
    POST,
    COMMENT
} from './../../../../providers/wordpress-api/interface';



@Injectable()
export class CommentEditModalService {


    modalRef = null;
    constructor(
        private modalService: NgbModal,
        private app: AppService
    ) {

    }

    open(post: POST, comment: COMMENT): Promise<any> {
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(CommentEditContent, { windowClass: 'comment-edit-modal', backdrop: 'static' });
        this.modalRef.componentInstance.setOptions(post, comment);
        return this.modalRef.result;
    }

}



