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





export class Base extends Library {
    constructor() {
        super();
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

    getErrorString(e): string {
        let code = this.getError(e).code;
        let str = text( code );
        return str;
        // return this.getError(e).code + ': ' + this.getError(e).message;
    }






}