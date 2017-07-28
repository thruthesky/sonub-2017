export let text = {
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
    }
};


text['auth/account-exists-with-different-credential'] = {
    en: text['social_register_email_exist']['en'],
    ko: text['social_register_email_exist']['ko']
};
