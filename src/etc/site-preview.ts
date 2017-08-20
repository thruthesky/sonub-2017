import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import { SITE_PREVIEW } from './../providers/wordpress-api/interface';
import { ForumService } from './../providers/wordpress-api/forum.service';
export class SitePreview {
    typing = new Subject<string>();
    loading: boolean = false;
    url: string = '';
    result: SITE_PREVIEW = <SITE_PREVIEW>{};
    listen = () => {
        this.typing
            .debounceTime(300) /// wait for 0.3s. you can edit.
            .subscribe(text => {
                console.log('text: ', text);
                let url = this.forum.getUrlOnTextBegin(text);
                if (url == this.url) return; // If same url, dont do it. Already done with the url.
                this.url = url;
                this.loading = true;
                console.log("For preview, sedning: ", this.url);
                this.forum.preview(this.url)
                    .subscribe(preview => {
                        console.log("preview: ", preview);
                        this.result = preview;
                        this.loading = false;
                    }, e => {
                        this.loading = false;
                        // do not alert. don't bother users.
                        // this.app.warning(e);
                        console.log(e);
                    });
            });
    }
    constructor(private forum: ForumService) {}
    get id() {
        if ( this.result && this.result.id ) return this.result.id;
        else return 0;
    }
}
