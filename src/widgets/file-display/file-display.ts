/**
 * Post View Component is not only used in forum pages but also other pages.
 * So, it is not in forum pages folder.
 * 
 * When you need it, import it in that module and use it.
 */
import { Component, OnInit, Input } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { FILES, FILE} from './../../providers/wordpress-api/interface';

@Component({
    selector: 'file-display-widget',
    templateUrl: 'file-display.html'
})

export class FileDisplayWidget implements OnInit {

    @Input() files: FILES;
    constructor(
        public app: AppService
    ) {
        
    }

    ngOnInit() { }
}
