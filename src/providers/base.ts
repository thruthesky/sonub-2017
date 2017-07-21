
export const ERROR = {
    login_failed: 'login failed'
};
export class Base {
    constructor() {

    }

    error( code, message? ) {
        return {
            code: code,
            message: message || ''
        }
    }



    randomString() {
        let d = new Date();
        let unique = d.getTime() + '_';
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 8; i++) {
            unique += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return unique;
    }


}