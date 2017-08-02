export interface ERROR_RESPONSE {
    code: string;
    message?: string;
};

export const ERROR = {
    EMPTY: -80010,
    NO_CODE: -80011,
    RESPONSE_EMPTY: -80021,
    RESPONSE_NO_CODE: -80031,
    CODE_KEY_IS_EMPTY: -40101,
    CODE_COMMENT_DUPLICATE: -41041
};


/**
 * Make and returns an Error Response Object
 * @param code 
 * @param message 
 */
export function error(code, message?): ERROR_RESPONSE {
    if (!message) message = '';
    return { code: code, message: message };
}