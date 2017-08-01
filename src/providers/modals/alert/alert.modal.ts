import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertContent } from './alert.content'
import { Base } from './../../../etc/base';


@Injectable()
export class AlertModalService extends Base {

  modalRef: NgbModalRef = null;
  constructor(
    private modalService: NgbModal
  ) {
    super();
  }

  open(a): Promise<any> {
    let options = {};
    if (typeof a === 'string') {
      options['content'] = a;
      options['button'] = 'Close';
    }
    else options = a;
    if (this.modalRef) this.modalRef.close();
    // return null;

    this.modalRef = this.modalService.open(AlertContent, { windowClass: 'alert-modal', backdrop: 'static' });
    this.modalRef.componentInstance.setOptions(options);
    return this.modalRef.result;
  }

  error(e): Promise<any> {
    let content = this.getTranslatedErrorString(e);
    return this.open({ title: 'ERROR', content: content, button: 'Close' });
  }

}