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

    /**
     * 
     * alert.error(), alert.notice() 를 호출 할 때, 커서가 input box 에 있으면 expression changed 에러가 발생한다.
     * 예를 들어, 코멘트를 너무 빨리 입력해서 comment flood 에러가 발생하는 경우, 또는 site preview 에러 등에서
     * 커서가 input box 에 있을 때, ng-bootstrap modal box 를 키면 expression changed 에러가 발생하는데,
     * 
     * cursor 가 있는 box 를 찾아서 .blur() 를 해 주고, modal 을 오픈한다.
     * 
     */
    if ( this.getActiveElement && this.getActiveElement['blur'] ) {
      this.getActiveElement.blur();
    }
    this.modalRef = this.modalService.open(AlertContent, { windowClass: cls, backdrop: 'static' });
    this.modalRef.componentInstance.setOptions(options);
    
    return this.modalRef.result;
  }

  /**
   * 
   * Display an error box to user ( monitor, phone )
   * 
   * @param e Error response from serve
   */
  error(e: ERROR_RESPONSE): Promise<any> {
    let content = this.getErrorString(e);
    return this.open({
      class: 'error error'+this.getError(e).code,
      title: text('error'),
      content: content,
      bottom: 'Error Code: ' + this.getError(e).code,
      button: text('close')
    });
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