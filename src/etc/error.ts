export interface ERROR_RESPONSE {
    code: string;
    message?: string;
};

export const ERROR = {

    /// client error.
    /// errors that may occur only in client begin with -800xxxx
    LOGIN_FIRST: -80005,
    EMPTY: -80010,
    NO_CODE: -80011,
    RESPONSE_EMPTY: -80021,
    RESPONSE_NO_CODE: -80031,
    USER_LOGIN_RESPONSE_HAS_NO_SESSION_ID: -80041,
    CODE_PERMISSION_DENIED_NOT_OWNER: -80201,



    // CODE_KEY_IS_EMPTY: -40101,
    // CODE_COMMENT_DUPLICATE: -41041,
    // CODE_WRONG_SESSION_ID: -42001,
    // CODE_NO_USER_BY_THAT_SESSION_ID: -42011,
    // CODE_PERMISSION_DENIED: -40444
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
