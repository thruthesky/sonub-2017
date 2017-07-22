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





}