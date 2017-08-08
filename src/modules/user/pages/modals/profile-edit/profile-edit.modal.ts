import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProfileEditContent } from './profile-edit.content';


import { USER_UPDATE
} from './../../../../../providers/wordpress-api/interface';



@Injectable()
export class ProfileEditModalService {


    modalRef = null;
    constructor(
        private modalService: NgbModal
    ) {

    }

    open(userData: USER_UPDATE): Promise<any> {
        if (this.modalRef) this.modalRef.close();
        this.modalRef = this.modalService.open(ProfileEditContent, { windowClass: 'profile-edit-modal', backdrop: 'static' });
        this.modalRef.componentInstance.setOptions( userData );
        return this.modalRef.result;
    }

}



