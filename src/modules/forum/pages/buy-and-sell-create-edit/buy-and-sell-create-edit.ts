import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, FILES, FILE } from './../../../../providers/app.service';
import { BUYANDSELL_CREATE, POST } from "../../../../providers/wordpress-api/interface";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { error, ERROR} from "../../../../etc/error";



@Component({
    selector: 'buy-and-sell-create-edit-page',
    templateUrl: 'buy-and-sell-create-edit.html'
})
export class BuyAndSellCreateEditPage {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    title: string = null;
    description: string = null;

    price: number = null;
    usedItem: 'y' | 'n' | 'x' = 'n';
    deliverable: 'y' | 'n' = 'n';

    city: string = 'all';
    province: string = 'all';
    tag: string = null;    // can be product, brands, shops
    contact: string = null;


    files: FILES = [];
    file: FILE;
    ID: number;

    provinces: Array<string> = [];
    cities: Array<string> = [];
    showCities: boolean = false;

    constructor(
        private region: PhilippineRegion,
        private router: Router,
        public app: AppService,
        private activeRoute: ActivatedRoute

    ) {

        region.get_province(re => {
            this.provinces = re;
        }, e => {
        });

        if( !app.user.isLogin ) {
            this.app.warning( error( ERROR.LOGIN_FIRST) );
            this.router.navigateByUrl('/user/login');
            return;
        }

        let params = activeRoute.snapshot.params;
        if (params['id']) {

            this.app.wp.post({ route: 'wordpress.get_post', ID: params['id'] })
                .subscribe((post: POST) => {

                    if ( post.author.ID && post.author.ID != app.user.id) {
                            this.app.warning( error( ERROR.CODE_PERMISSION_DENIED_NOT_OWNER) );
                            this.router.navigateByUrl('/buyandsell');
                            return;
                    }

                    console.log('edit post: ', post);

                    
                    this.ID = post.ID;
                    this.title = post.post_title;
                    this.description = post.post_content;
                    this.price = post.int_1;
                    this.usedItem = <any>post.char_1;
                    this.deliverable = <any>post.char_2;
                    this.city = post.varchar_1;
                    this.province = post.varchar_2;
                    this.tag = post.varchar_3;
                    this.contact = post.meta.contact;


                    if (post.files.length) {
                        this.files[0] = post.files[0];
                        this.file = post.files[0];
                    }

                    if( post.varchar_2 != 'all' ) this.getCities();
                }, e => this.app.warning(e));

        }

    }

    onClickProvince() {
        console.log('Province::', this.province);
        if (this.province != 'all') {
            this.city = this.province;
            this.getCities();
        }
        else {
            this.city = 'all';
            this.showCities = false;
        }
    }

    getCities() {
        this.region.get_cities(this.province, re => {
            if (re) {
                this.cities = re;
                this.showCities = true;
            }
        }, e => {
        });
    }

    get cityKeys() {
        return Object.keys(this.cities);
    }

    onClickSubmit() {


        let data: BUYANDSELL_CREATE = {
            tag: this.tag,
            usedItem: this.usedItem,
            province: this.province,
            city: this.city,
            deliverable: this.deliverable,
            price: this.price,
            title: this.title,
            description: this.description,
            contact: this.contact,
        };
        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);
        data['ID'] = this.ID;

        console.log('onClickSubmit::data:: ', data);
        this.app.bns.create(data).subscribe(res => {
            console.log("buyandsell create/edit: ", res);
            this.app.alert.open({ content: this.app.text('saved') });
            this.router.navigateByUrl('/buyandsell');
        }, e => this.app.warning(e));

    }

}
