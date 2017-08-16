import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertContent } from './alert.content'
import { Base } from './../../../etc/base';
import { ERROR_RESPONSE } from './../../../etc/error';
import { text } from './../../../etc/text';



@Injectable()
export class AlertModalService extends Base {

  modalRef: NgbModalRef = null;
  constructor(
    private modalService: NgbModal
  ) {
    super();
  }


  /**
   * 
   * @param a 
   */
  open(a): Promise<any> {
    let options = {};
    if (typeof a === 'string') {
      options['content'] = a;
      options['button'] = 'Close';
    }
    else options = a;

    if (this.modalRef) this.modalRef.close();
    // return null;
    let cls = 'alert-modal';
    if ( options['class'] ) cls += ' ' + options['class'];
    this.modalRef = this.modalService.open(AlertContent, { windowClass: cls, backdrop: 'static' });
    this.modalRef.componentInstance.setOptions(options);
    
    return this.modalRef.result;
  }

  /**
   * 
   * @param e 
   */
  error(e: ERROR_RESPONSE): Promise<any> {
    let content = this.getErrorString(e);
    return this.open({ class: 'error', title: text('error'), content: content, button: text('close') });
  }


  /**
   * 
   * @param title 
   * @param content 
   */
  notice( title, content ) {
    return this.open({ class: 'notice', title: text(title), content: text(content), button: text('close') });
  }

}