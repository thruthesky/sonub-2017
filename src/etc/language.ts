const LANGUAGE_KEY = 'language';

/**
 * Returns web browser language.
 * @return 2 lettters of language code like 'en', 'ko'.
 * 
 */
export function getBrowserLanguage() {
    let ln = navigator['languages'] && navigator['languages'][0] ||
        navigator['language'] ||
        navigator['userLanguage'];
    if (!ln) return 'en';
    if (typeof ln !== 'string') return 'en';
    return ln.substring(0, 2);
}


/**
 * Returns
 *      - user language ( that user has already chosen )
 *      - or browser language ( if no user language );
 */
export function getLanguage(): string {
    let lc = localStorage.getItem(LANGUAGE_KEY);
    if (lc) return lc;
    else return getBrowserLanguage();
}
/**
 * 
 * Save user language on localStorage and sync to backend.
 * 
 * @param ln - user language like 'en', 'ko'
 */
export function setLanguage(ln: string) {
    localStorage.setItem( LANGUAGE_KEY, ln );

    return this.user.update_user_meta( LANGUAGE_KEY, ln).subscribe(key => {
        console.log("Language update success: ", key);
        // this.storage.set(USER_TOKEN_KEY, token);
    }, e => {
        console.error(e);
        this.alert('Failed to save user language to server ...');
    });
}
