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
export function setLanguage(ln: string) {
    localStorage.setItem( LANGUAGE_KEY, ln );
}
