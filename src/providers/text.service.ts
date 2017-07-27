import { Injectable } from '@angular/core';
import { text } from './../etc/text';

@Injectable()
export class TextService {

    constructor() { }


    get deleteConfirm() {
        let o = {
            content: 'Do you want to delete?',
            buttons:
            [
                { code: 'yes', text: 'Yes' },
                { code: 'no', text: 'No' }
            ]
        };
        return o;
    }

    translate( msg ) {
        console.log(text);
        console.log(msg);
        if ( text[msg] ) return text[msg]['en'];
        else return msg;
    }
}