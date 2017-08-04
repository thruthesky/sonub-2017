import { ERROR } from './error';
import { getLanguage } from './language';


export let TEXT = {
    welcome: {
        en: 'Welcome, #name.',
        ko: '어서오십시오, #name님'
    },
    error: {
        en: 'Error',
        ko: '에러'
    },
    close: {
        en: 'Close',
        ko: '닫기'
    },
    user_exist: {
        en: 'User login ID is already exist. Please choose another.',
        ko: '입력하신 아이디는 이미 존재합니다. 다른 아이디를 입력하세요.'
    },
    email_exist: {
        en: 'Your email has been registered already. Please use your email to login. You can request a new password.',
        ko: '이미 가입된 이메일입니다. 해당 메일로 로그인을 하시면 됩니다. 또는 새 비밀번호를 요청하십시오.'
    },
    social_register_email_exist: {
        en: 'You are trying to login with social service but the email of that social service has already registered. This means you have to use the other social login service that you used to login before.',
        ko: '앗! 소셜 로그인을 하시려는데, 그 소셜 서비스 계정의 메일 주소가 이미 가입되어져 있습니다. 이전에 로그인을 할 때 사용한 소셜 서비스로 로그인을 해 주십시오.'
    },
    replied: {
        en: '#name commented: ',
        ko: '#name님의 코멘트: '
    },
    confirmDelete: {
        en: {
            content: 'Do you want to delete #no?',
            buttons:
            [
                { code: 'yes', text: 'Yes' },
                { code: 'no', text: 'No' }
            ]
        },
        ko: {
            content: '#no번 글을 삭제를 하시겠습니까?',
            buttons:
            [
                { code: 'yes', text: '예' },
                { code: 'no', text: '아니오' }
            ]
        }
    }
};


TEXT['auth/account-exists-with-different-credential'] = {
    en: TEXT['social_register_email_exist']['en'],
    ko: TEXT['social_register_email_exist']['ko']
};


/**
 * For number code.
 */
TEXT[ERROR.EMPTY] = { en: 'Error object is empty', ko: '에러 값이 없습니다.' };
TEXT[ERROR.NO_CODE] = { en: 'Error object has no code', ko: '에러 값에 코드가 없습니다.' };
TEXT[ERROR.RESPONSE_EMPTY] = { en: 'Response from backend is empty. This may be a server error.', ko: '서버로 부터 결과 값이 없습니다. 서버 에러 일 수 있습니다.' };
TEXT[ERROR.RESPONSE_NO_CODE] = { en: 'Response from backend has no code', ko: '서버로 부터 응답 중에 코드 값이 없습니다.' };
TEXT[ERROR.CODE_KEY_IS_EMPTY] = { en: 'Key is empty', ko: '키 값이 존재하지 않습니다.' };
TEXT[ERROR.CODE_COMMENT_DUPLICATE] = { en: 'Please do not comment with same text.', ko: '비슷한 내용의 덧글을 반복적으로 작성 할 수 없습니다.' };
TEXT[ERROR.LOGIN_FIRST] = { en: 'Please login first', ko: '로그인을 먼저하십시오.'};


/**
 * 
 * @note default language is 'en'.
 * @param code 
 * @param args 
 */
export function text(code, args?) {
    let ln;
    if (args && args['ln']) ln = args['ln'];
    else ln = getLanguage();

    if (TEXT[code] === void 0) return code; // no code?
    if (TEXT[code][ln] === void 0) { // no code for that language ?
        // try 'en' for default language.
        if ( TEXT['code']['en'] === void 0 ) return code;
        else ln = 'en';
    }

    let str = TEXT[code][ln];

    if (args) {
        let json = false;
        if (typeof str === 'object') { str = JSON.stringify(str); json = true; }
        for (let i in args) {
            str = str.replace('#' + i, args[i]);
        }
        if (json) str = JSON.parse(str);
    }
    return str;
}

