import { Injectable } from '@angular/core';
import { AlertModalService } from './modals/alert/alert.modal';
import { ShareService } from './share.service';

import { Base } from './../etc/base';


import { error, ERROR, ERROR_RESPONSE } from './../etc/error';
import { UserService } from './wordpress-api/user.service';


@Injectable()
export class ErrorService extends Base {

    constructor(
        private share: ShareService,
        private alertService: AlertModalService,
        private user: UserService
    ) {
        super();
    }
    /**
     * 
     * @use this to display error message.
     * 
     * @param e - is an Error Response Object or ERROR code ( interger less than 0 ) from error.ts
     * @param message - is only used when e is ERROR code.
     * 
     * @example e => app.warning(e); // 'e' is server response.
     * @example app.warning(-8088, 'Wrong user. User Xapi ID does not exist on firebase.');
     */
    alert(e, message?) {

        if ( ! e ) return console.error("ErrorService::alert() => No e");

        ///
        /// setTimeout() here is for preventing error of 'ExpressionChangedAfterItHasBeenCheckedError'
        ///     - when the focus is on input-box, and ngb-modal opens, it produces 'expression changed' error.
        ///
        // setTimeout(() => {
        if (typeof e == 'number' && e < 0) {
            e = { code: e };
            if (message) e['message'] = message;
        }
        // this.alert.error(e)
        console.log("ErrorService::alert() : ", e);

        if ( this.isWrongSessionInfo(e) ) {
            this.share.logout();
            return;
        }
        if ( this.filterError( e ) ) return;


        setTimeout(() => this.alertService.error(e), 1); /// for 'ExpressionChangedAfterItHasBeenCheckedError' error
        this.share.rerenderPage(150);
        // }, 100 );
    }


    warning( e, message? ) {
        this.alert( e, message );
    }


    /**
     * Filters error message to display to user.
     * @param e error response
     * @return
     *      - true if the error should not be display to user.
     *      - false if the error should be display to the user.
     */
    private filterError(e: ERROR_RESPONSE) {
        if ( this.isWrongSessionInfo(e) ) { /// don't alert for wrong session info.
            console.error("Don't alert for: ", e);
            return true;
        }
    }

    isWrongSessionInfo(e: ERROR_RESPONSE) {
        if (e && e.code && e.code == -42001 ) return true;
    }
}