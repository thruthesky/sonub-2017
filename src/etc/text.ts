import { ERROR } from './error';
import { getLanguage } from './language';


export let TEXT = {
    welcome: {
        en: 'Welcome, #name.',
        ko: '어서오십시오, #name님'
    },
    loading: {
        en: 'loading',
        ko: '로딩 중'
    },
    login: {
        en: 'Login',
        ko: '로그인'
    },
    register: {
        en: 'Register',
        ko: '회원가입'
    },
    more: {
        en: 'more',
        ko: '더보기'
    },
    name: {
        en: 'Name',
        ko: '이름'
    },
    email: {
        en: 'Email',
        ko: '이메일'
    },
    mobile_no: {
        en: 'Mobile No.',
        ko: '휴대폰 번호'
    },
    password: {
        en: 'Password',
        ko: '비밀번호'
    },
    title: {
        en: 'Title',
        ko: '제목'
    },
    summary: {
        en: 'Summary',
        ko: '요약'
    },
    domain: {
        en: 'Domain',
        ko: '도메인'
    },
    display_advertisement: {
        en: 'Display advertisement',
        ko: '광고 표시'
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
    cancel: {
        en: 'Cancel',
        ko: '취소'
    },
    submit_post: {
        en: 'Submit Post',
        ko: '글 등록하기'
    },
    update_post: {
        en: 'Update Post',
        ko: '글 수정하기'
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
    my_activity: {
        en: 'My Activity',
        ko: '내 활동 로그'
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
    rules: {
        en: 'Rules',
        ko: '규정'
    },
    advertising: {
        en: 'Advertising',
        ko: '광고안내'
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

    input_title: {
        en: 'Input title',
        ko: '제목을 입력하세요.'
    },
    input_content: {
        en: 'Input content',
        ko: '내용을 입력하세요.'
    },

    start_discussion: {
        en: 'Start a Discussion',
        ko: '자유게시판 글쓰기'
    },
    discussion_description: {
        en: 'Please share your thoughts and ideas.',
        ko: '자유토론 게시판입니다.'
    },
    ask: {
        en: 'Ask',
        ko: '질문하기'
    },
    sell: {
        en: 'Sell',
        ko: '물건팔기'
    },
    hire: {
        en: 'Hire',
        ko: '사람구하기'
    },

    search_for: {
        en: 'Search for ... ?',
        ko: '검색하기 ...'
    },
    what_are_you_searching: {
        en: 'What are you searching for?',
        ko: '무엇이든지 검색해 보세요.'
    },

    jobs: {
        en: 'Jobs',
        ko: '구인구직'
    },
    job_description: {
        en: '',
        ko: ''
    },

    crowded_forums: {
        en: 'Crowded Forums',
        ko: '새글이 많은 게시판'
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

    /// menu, button text


    recent_popluar_posts: { en: 'Recent Issues', ko: '최근 이슈' },
    input_chat_message: { en: 'Please input message.', ko: '채팅 메세지를 입력하세요.' },
    unread_chat_messages: { en: 'New Messages', ko: '새 채팅 메세지' },

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
    news_description: {
        en: 'Find the latest news. Please post your news also.',
        ko: '새로운 뉴스를 전해드립니다. 여러분의 뉴스를 올려주세요.'
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
        en: 'Ask',
        ko: '질문과답변'
    },
    qna_description: {
        en: 'Ask anything. Please answer and earn badges.',
        ko: '무엇이든 물어보세요. 답변을 하고 내공을 쌓으세요.'
    },
    create_question: {
        en: 'Ask',
        ko: '질문하기'
    },

    choose_forum: {
        en: 'Choose Forum',
        ko: '게시판 선택'
    },
    discussion: {
        en: 'Discussion',
        ko: '자유게시판'
    },
    buyandsell: {
        en: 'Buy&Sell',
        ko: '장터'
    },

    message: {
        en: 'Message',
        ko: '메세지'
    },
    settings: {
        en: 'Settings',
        ko: '설정'
    },

    ///
    community_logs: {
        en: 'Latest Articles',
        ko: '최근 커뮤니티 글'
    },
    post_view_loading: {
        en: 'Please wait while loading post',
        ko: '서버로 부터 글을 가져 오는 중입니다.'
    },

    ///
    sponsered: {
        en: 'Sponsered',
        ko: '광고'
    },

    create_ad: {
        en: 'Create Ad',
        ko: '광고 등록'
    },

    upload_photo: {
        en: 'Upload photos',
        ko: '사진 올리기'
    },
    no_activity_description: {
        en: 'Ooh, You have no activity record. Try to write posts and comments.',
        ko: '앗, 활동 기록이 없네요. 글이나 코멘트를 작성해 보세요.'
    },

    no_more_data: {
        en: 'Ooh, There is no more data.',
        ko: '앗, 더 이상 자료가 없습니다.'
    },
    _resign: {
        en: 'Resign',
        ko: '탈퇴'
    },
    profile_update: {
        en: 'Update',
        ko: '회원 정보 수정'
    },
    logout: {
        en: 'Logout',
        ko: '로그아웃'
    },
    change_password: {
        en: 'Change Password',
        ko: '비밀번호 변경'
    },

    gender: {
        en: 'Gender',
        ko: '성별'
    },
    birthday: {
        en: 'Birthday',
        ko: '성별'
    },
    male: {
        en: 'Male',
        ko: '남자'
    },
    female: {
        en: 'Female',
        ko: '여자'
    },
    change_profile_photo: {
        en: 'Change Profile Photo',
        ko: '회원 사진 변경'
    },
    save: {
        en: 'Save',
        ko: '저장'
    },
    save_profile: {
        en: 'Save Profile',
        ko: '회원 정보 저장'
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
    },
    changePassword: {
        en: {
            content: 'Change Password Success',
            buttons:
                [
                    { code: 'close', text: 'Close' }
                ]
        },
        ko: {
            content: 'Change Password Success',
            buttons:
                [
                    { code: 'close', text: '닫기' }
                ]
        }
    },
    resign: {
        en: {
            title: 'Delete your account permanently.',
            content: 'Are you sure you want to deactivate your account?',
            buttons:
                [
                    { code: 'yes', text: 'Yes' },
                    { code: 'no', text: 'No' }
                ]
        },
        ko: {
            title: '회원 탈퇴',
            content: '정말 회원 탈퇴를 하시겠습니까?',
            buttons:
                [
                    { code: 'yes', text: '예' },
                    { code: 'no', text: '아니오' }
                ]
        }
    },

    /// errors

    this_post_is_not_owned_by_you_on_delete_post: {
        en: 'You cannot delete this. Permission denied.',
        ko: '글을 삭제 할 수 없습니다. 권한 없음.'
    },


    /// chat
    recent_chat_users: {
        en: 'Recent Chat Users',
        ko: '최근 채팅 사용자 목록'
    },
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
TEXT[ERROR.LOGIN_FIRST] = { en: 'Please login first', ko: '로그인을 먼저하십시오.' };
TEXT[ERROR.CODE_PERMISSION_DENIED_NOT_OWNER] = { en: 'You do not have permission.', ko: '권한이 없습니다.'};
TEXT[ERROR.CHAT_ROOM_PATH] = {en: 'Cannot find chat server path. Please inform it to web master.', ko: '채팅 서버의 경로를 찾을 수 없습니다. 웹마스터에게 연락해 주세요.'};
TEXT[ERROR.WRONG_PATH] = {en: 'You have accessed with wrong route.', ko: '잘못된 경로로 접속을 하였습니다.'};
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
        if (TEXT[code]['en'] === void 0) return code;
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

