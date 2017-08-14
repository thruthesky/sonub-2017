import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { AppService } from './../../../../providers/app.service';
@Component({
    selector: 'rules-page',
    templateUrl: 'rules.html'
})

export class RulesPage implements OnInit {
    html = '';
    constructor(
        http: Http,
        app: AppService
    ) {
        http.get( environment.serverUrl + '/wp-content/plugins/xapi-2/pages/rules-page.php?ln=' + app.getLanguage() )
            .subscribe( res => {
                console.log(res);
                this.html = app.safeHtml( res['_body'] );

            }, e => app.warning(e) );
    }

    ngOnInit() { }
}