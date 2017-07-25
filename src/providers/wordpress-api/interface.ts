
export interface REQUEST {
    route?: string;
    session_id?: string;
};

interface ID {
    ID: number;
};
interface ID_O {
    ID?: number;
};
interface CATEGORY {
    category: string;
};
interface CATEGORY_O {
    category?: string;
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



export interface UPLOADED_FILE {
    id: number;
    type: any;          // can be 'false' if file type is not recognized.
    url: string;
    name: string;
}
export type UPLOADED_FILES = Array<UPLOADED_FILE>;
export type FILE = UPLOADED_FILE;
export type FILES = UPLOADED_FILES;


/**
 * Used by forum.postList(), forum.postSearch()
 */
export interface COMMENT {
    comment_ID: number;
    comment_approved: string;
    comment_author: string;
    comment_content: string;
    comment_date: string;
    comment_parent: number;
    comment_post_ID: number;
    comment_type: string;
    depth: number;
    user_id: number;
};


interface POST_META {
    post_author_name?: string;
    post_author_email?: string;
    post_author_phone_number?: string;
}
// interface IMAGE {
//     [ID: number]: string;
// };
// type IMAGES = Array<IMAGE>;
export type COMMENTS = Array<COMMENT>;

export interface POST_CREATE_COMMON {
    post_title: string;
    post_content?: string;
    post_password?: string;
    post_author_name?: string;                  /// This is anonymous user name when a anonymous post without login.
    post_author_email?: string;                 /// Anonymous email
    post_author_phone_number?: string;          /// Anonymous phone number.
    fid?: Array<number>;
};
export interface POST_READ_COMMON extends ID, POST_CREATE_COMMON {
    author_name: string;
    comment_count: number;
    comments: COMMENTS;
    guid: string;
    meta: POST_META;
    files: UPLOADED_FILES;
    post_author?: string;
    post_date: string;
    post_parent: number;
};

export interface POST_CREATE extends REQUEST, CATEGORY, POST_CREATE_COMMON { };
export type POST_CREATE_RESPONSE = number;

export interface POST_UPDATE extends REQUEST, ID, CATEGORY_O, POST_CREATE_COMMON { };
export type POST_UPDATE_RESPONSE = number;


export interface POST_DATA extends REQUEST, ID { };
export interface POST_DELETE extends REQUEST, ID { };

export interface POST_DATA_RESPONSE extends ID, POST_READ_COMMON { };


export interface POST extends POST_DATA_RESPONSE { };
export type POSTS = Array<POST>;



export interface POST_LIST extends REQUEST {
    category_name: string; // category name
    posts_per_page?: number; // no of posts in a page.
    paged?: number; // what page.
};

export interface POST_LIST_RESPONSE {
    posts: POSTS;
    post_count: number; // no of posts retrived from database. if it is less than POST_LIST.posts_per_page, this may be the last page.
    found_posts: number; // no of total posts found by the search of POST_LIST request. This is the number of posts by the search.
    max_num_pages: number; // no of total pages by the POST_LIST search request.



    //// Below are coming from https://codex.wordpress.org/Class_Reference/WP_Query#Properties $query_vars
    cat: string;                    // catgory no
    category_name: string;          // category name
    comments_per_page: string;      // comments_per_page
    paged: number;                  // paged

};


export interface POST_SEARCH extends POST_LIST {
    s: string;
};
export interface POST_SEARCH_RESPONSE extends POST_LIST_RESPONSE { };


// https://codex.wordpress.org/Function_Reference/wp_new_comment
export interface COMMENT_CREATE extends REQUEST {
    comment_post_ID: number; // root post ID. to which post the comment will show up.
    comment_author?: string; // fixed value - can be dynamic 
    comment_author_email?: string;  // fixed value - can be dynamic 
    comment_author_url?: string; // URL of the author or content or any url. fixed value - can be dynamic 
    comment_content?: string; // Comment messsage... //fixed value - can be dynamic 
    comment_parent?: string; // parent comment to reply under that comment. 0 if it's not a reply to another comment; if it's a reply, mention the parent comment ID here
    // user_id?: number; // $current_user->ID, //passing current user ID or any predefined as per the demand
};

export interface COMMENT_UPDATE extends REQUEST {
    comment_ID: number;
    comment_content: string;
};

export type COMMENT_CREATE_RESPONSE = number;
export type COMMENT_UPDATE_RESPONSE = number;


export interface COMMENT_DATA extends REQUEST {
    comment_ID: number;
}

/**
 * This is being used by forum.commentData()
 * COMMENT_DATA_RESPONSE is different from COMMENT.
 */
export interface COMMENT_DATA_RESPONSE {
        comment_ID: number;
        comment_post_ID: number;
        comment_author: string;
        comment_author_email: string;
        comment_author_url: string;
        comment_date: string;
        comment_content: string;
        comment_parent: number;
        user_id: number;
};


export interface CATEGORY_ENTITY {
    term_id: number;
    name:string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
    cat_ID: number;
    category_count:number;
    category_description: string;
    cat_name: string;
    category_nicename: string;
    category_parent: number;
};

export type CATEGORIES = Array<CATEGORY_ENTITY>;

