/**
 * 
 * Base for the sonub app.
 * 
 * @Warning Only put codes that are necessary on ALL component/service/directives.
 * @Warning If it is a library, then don't put it here.
 * @Warning If it a constant, defines, intefaces, .. don't put here.
 * 
 * 
 */
import { Library } from './library';

import { error, ERROR, ERROR_RESPONSE } from './error';

import { text } from './text';


import { environment } from './../environments/environment';



export class Base extends Library {
    constructor() {
        super();
    }


    xapiUrl() {
        return environment.serverUrl + '/wp-json/xapi/v2/do';
    }

    postUrl(id: number): string {
        return '/view/' + id;
    }

    // error(code, message?) {
    //     return {
    //         code: code,
    //         message: message || ''
    //     }
    // }

    /**
     * 
     * @param str 
     */
    getError(e): ERROR_RESPONSE {
        console.log('getError:', e);
        if (!e) return error(ERROR.EMPTY); // e is falsy.
        else if (e.code === void 0) return error(ERROR.NO_CODE);
        return e;
    }

    /**
     * 
     * If the code of `Error response` exists in `text.ts`, then it returns the message of `text.ts`
     * Or it will return the error code and message from error response.
     * 
     * @param e Error response from backend.
     */
    getErrorString(e): string {
        let code = this.getError(e).code;
        console.log("error code: ", code);

        // get error message from the code
        let str = text(code);

        if ( str == code ) {        /// no error message by that code?
            str = code + ': ' + this.getError(e).message;
        }
        return str;
        // return this.getError(e).code + ': ' + this.getError(e).message;
    }






}