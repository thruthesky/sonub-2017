
export interface REQUEST {
    route?: string;
    session_id?: string;
};


export interface SOCIAL_PROFILE {
    uid: string;                // User ID of the social.
    email?: string;
    providerId?: string;
    name?: string;              // displayName
    photoURL?: string;
};


export interface USER_LOGIN {
    route?: string;
    user_login: string;
    user_pass: string;
}

export interface USER_COMMON {
    user_email: string;
    name?: string;
    mobile?: string;
    gender?: string;
    address?: string;
    birthday?: string;
    landline?: string;
}
export interface USER_REGISTER extends USER_LOGIN, USER_COMMON { };


export interface USER_REGISTER_RESPONSE {
    user_login: string;
    user_email: string;
    user_nicename: string;
    session_id: string;
};
export interface USER_LOGIN_RESPONSE extends USER_REGISTER_RESPONSE { };
export interface USER_UPDATE_RESPONSE extends USER_REGISTER_RESPONSE { };

export interface USER_UPDATE extends REQUEST, USER_COMMON { };

export interface USER_DATA extends REQUEST { };
export interface USER_DATA_RESPONSE extends USER_COMMON { };



export interface POST_COMMON {
    post_title: string;
    post_content?: string;
};

export interface POST_CREATE extends REQUEST, POST_COMMON {
    category: string;
};


export interface POST_UPDATE extends REQUEST, POST_COMMON {
    category: string;
    ID: number;
};

export interface POST_DATA extends REQUEST {
    post_ID: number;
}