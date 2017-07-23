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


export interface ERROR_INFO {
    code: string;
    message?: string;
}



export class Base extends Library {
    constructor() {
        super();
    }

    error(code, message?) {
        return {
            code: code,
            message: message || ''
        }
    }

    /**
     * 
     * @param str 
     */
    getError(e): ERROR_INFO {
        if (!e) return { code: 'error-object-is-empty-in-getError' };
        if ( e.error !== void 0 ) e = e.error;  /// Wordpress Error Object returned from Wordpress api.
        if (e.code === void 0 && e.message === void 0) return { code: 'error-object-has-no-code-and-message-in-getErrror' };
        e.code = e.code || e.message;
        e.message = e.message || e.code;
        return {
            code: e.code,
            message: e.message
        };
    }

    getErrorString(e): string {
        return this.getError(e).code + ': ' + this.getError(e).message;
    }




}