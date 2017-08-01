export const ERROR = {
    EMPTY: -80010,
    NO_CODE: -80011,
    RESPONSE_EMPTY: -80021,
    RESPONSE_NO_CODE: -80031
};

let EM = {};
EM[ ERROR.EMPTY ] = 'Error object is empty';
EM[ ERROR.NO_CODE ] = 'Error object has no code';
EM[ ERROR.RESPONSE_EMPTY ] = 'Response from backend is empty. This may be a server error.';
EM[ ERROR.RESPONSE_NO_CODE ] = 'Response from backend has no code';


export function error(code, message?) {
    message = message || EM[code];
    return { code: code, message: message };
}