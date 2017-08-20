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

    get serverUrl() {
        return environment.serverUrl;
    }

    xapiUrl() {
        return this.serverUrl + '/wp-json/xapi/v2/do';
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
     * It only check if the ERROR_REPONSE is right.
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
     * @Logic
     *      1. If the input `Error Response Object` - 'e' has 'message' property, it returns the 'message' that is directly coming from the server.
     *      2. If `Error Response Object` - 'e' has 'code' property and the 'code' exists in `text.ts`, then it returns the message of `text.ts`
     *      3. Or it will return the error code since there is no message.
     * 
     * @param e Error response from backend.
     */
    getErrorString(e: ERROR_RESPONSE): string {
        if ( this.getError(e).message ) return this.getError(e).message;

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