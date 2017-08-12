import { ERROR } from './error';
import { getLanguage } from './language';


export let TEXT = {
    welcome: {
        en: 'Welcome, #name.',
        ko: '어서오십시오, #name님'
    },
    login: {
        en: 'Login',
        ko: '로그인'
    },
    home: {
        en: 'Home',
        ko: '홈'
    },
    sonub: {
        en: 'Sonub',
        ko: '소셜허브'
    },
    forum: {
        en: 'Forum',
        ko: '게시판'
    },
    profile: {
        en: 'User Profile',
        ko: '회원 정보'
    },
    error: {
        en: 'Error',
        ko: '에러'
    },
    close: {
        en: 'Close',
        ko: '닫기'
    },
    yes: {
        en: 'Yes',
        ko: '예'
    },
    no: {
        en: 'No',
        ko: '아니오'
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
        en: 'Oh! You have logged in with your social service but failed login to the site. This means you have logged in already with different social login or registered to the site. Please use other social or site login.',
        ko: '앗! 소셜 로그인은 성공했는데, 홈페이지 로그인에 실패했습니다. 방금 사용한 소셜 서비스 계정의 메일 주소가 이미 가입되어져 있는 것으로, 이전에 다른 소셜 서비스로 로그인을 했거나 홈페이지에 회원 가입을 하였습니다. 다른 소셜 또는 아이디로 로그인을 해 주세요.'
    },
    replied: {
        en: '#name commented: ',
        ko: '#name님의 코멘트: '
    },
    login_first: {
        en: 'Please login first',
        ko: '로그인을 먼저 하세요.'
    },
    select_image: {
        en: 'Select a image.',
        ko: '이미지를 선택해 주세요.'
    },
    select_advertisement_image: {
        en: 'Select an advertisement image.',
        ko: '광고 이미지를 선택해 주세요.'
    },
    advertisement_delete: {
        en: 'Do you want to delete this advertisement?',
        ko: '광고를 삭제하시겠습니까?'
    },
    saved: {
        en: 'Successfully saved.',
        ko: '저장되었습니다.'
    },
    ok: {
        en: 'Ok',
        ko: '확인'
    },

    create_a_post: {
        en: 'Create a Post',
        ko: '글 등록하기'
    },


    /// page title
    menu_page_title: {
        en: 'Menus',
        ko: '메뉴 페이지'
    },

    menu_page_description: {
        en: 'You will see all the menus in this page.',
        ko: '이 페이지에서 모든 메뉴를 볼 수 있습니다.'
    },



    /// forum create name
    food: {
        en: 'Food',
        ko: '음식'
    },
    food_description: {
        en: 'Share your thoughts about Food.',
        ko: '음식과 관련된 정보를 공유하는 게시판입니다.'
    },

    news: {
        en: 'News',
        ko: '뉴스'
    },
    headline_news: {
        en: 'Headline News',
        ko: '헤드라인 뉴스'
    },

    create_post: {
        en: 'Create #category',
        ko: '#category 등록'
    },

    qna: {
        en: 'Questions &amp; Answers',
        ko: '질문과답변'
    },
    create_question: {
        en: 'Ask',
        ko: '질문하기'
    },

    ///
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
TEXT[ERROR.NO_CODE] = { en: 'No Code. This may be server error or server down.', ko: '코드가 없습니다. 서버 에러 또는 서버 다운 일 수 있습니다.' };
TEXT[ERROR.RESPONSE_EMPTY] = { en: 'Response from backend is empty. This may be a server error.', ko: '서버로 부터 결과 값이 없습니다. 서버 에러 일 수 있습니다.' };
TEXT[ERROR.RESPONSE_NO_CODE] = { en: 'Response from backend has no code', ko: '서버로 부터 응답 중에 코드 값이 없습니다.' };
TEXT[ERROR.CODE_KEY_IS_EMPTY] = { en: 'Key is empty', ko: '키 값이 존재하지 않습니다.' };
TEXT[ERROR.CODE_COMMENT_DUPLICATE] = { en: 'Please do not comment with same text.', ko: '비슷한 내용의 덧글을 반복적으로 작성 할 수 없습니다.' };
TEXT[ERROR.LOGIN_FIRST] = { en: 'Please login first', ko: '로그인을 먼저하십시오.' };
TEXT[ERROR.CODE_WRONG_SESSION_ID] = { en: 'Wrong login information. Wrong session. Please login again.', ko: '로그인 오류. 로그인 정보가 올바르지 않습니다. 로그인을 다시 해 주세요.' };
TEXT[ERROR.CODE_NO_USER_BY_THAT_SESSION_ID] = { en: 'Wrong loing information. No user. Please login again.', ko: '로그인 오류. 로그인 정보를 찾을 수 없습니다. 다시 로그인을 해 주세요.' };


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
        if (TEXT['code']['en'] === void 0) return code;
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


export function textUpper(code, args?) {
    let re = text(code, args);
    if (typeof re === 'string') return re.toUpperCase();
    else return re;
}
export function textLower(code, args?) {
    let re = text(code, args);
    if (typeof re === 'string') return re.toLowerCase();
    else return re;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function textFc(code, args?) {
    let re = text(code, args);
    if (typeof re === 'string') return capitalizeFirstLetter( re );
    else return re;
}

