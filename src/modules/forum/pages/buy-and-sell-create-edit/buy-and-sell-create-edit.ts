import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, FILES } from './../../../../providers/app.service';
import { BUYANDSELL, BUYANDSELL_CREATE } from "../../../../providers/wordpress-api/interface";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { error, ERROR} from "../../../../etc/error";



@Component({
    selector: 'buy-and-sell-create-edit-page',
    templateUrl: 'buy-and-sell-create-edit.html'
})
export class BuyAndSellCreateEditPage {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    title: string = '';
    description: string = '';

    price: number = null;
    usedItem: 'y' | 'n' | 'x' = 'n';
    deliverable: 'y' | 'n' = 'n';

    city: string = 'all';
    province: string = 'all';
    tag: string = '';    // can be product, brands, shops
    contact: string = '';


    files: FILES = [];
    ID: number;

    provinces: Array<string> = [];
    cities: Array<string> = [];
    showCities: boolean = false;

    errorMessage: string = null;
    loading: boolean = false;
    text: any = {};


    constructor(
        private region: PhilippineRegion,
        private router: Router,
        public app: AppService,
        private activeRoute: ActivatedRoute

    ) {

        region.get_province(re => {
            this.provinces = re;
        }, () => {
        });

        let codes = [
            'buyandsell_edit_create',
            'buyandsell_edit_create_desc',
            'tag_title', 'tag_desc', 'tag_placeholder',
            'is_used', 'is_used_desc', 'yes', 'no', 'not_applicable',
            'location', 'select_province', 'city',
            'price', 'price_desc', 'price_holder',
            'deliverable', 'deliverable_desc',
            'buyandsell_title_holder', 'buyandsell_title_desc',
            'buyandsell_description', 'buyandsell_description_desc', 'buyandsell_description_holder',
            'contact_info', 'contact_info_holder', 'contact_info_desc',
            'buyandsell_upload_image', 'buyandsell_upload_image_desc', 'upload_image',
            'buyandsell_submit'
        ];
        app.wp.text(codes, re => this.text = re);

        if( !app.user.isLogin ) {
            this.app.warning( error( ERROR.LOGIN_FIRST) );
            this.router.navigateByUrl('/user/login');
            return;
        }

        let params = activeRoute.snapshot.params;
        if (params['id']) {

            this.app.bns.data({ route: 'wordpress.get_post', ID: params['id'] })
                .subscribe((buyAndSell: BUYANDSELL) => {

                    if ( buyAndSell.author.ID && buyAndSell.author.ID != app.user.id) {
                            this.app.warning( error( ERROR.CODE_PERMISSION_DENIED_NOT_OWNER) );
                            this.router.navigateByUrl('/buyandsell');
                            return;
                    }

                    // console.log('edit post: ', buyAndSell);

                    this.ID = buyAndSell.ID;
                    this.title = buyAndSell.title;
                    this.description = buyAndSell.description;
                    this.price = buyAndSell.price;
                    this.usedItem = buyAndSell.usedItem;
                    this.deliverable = buyAndSell.deliverable;
                    this.city = buyAndSell.city;
                    this.province = buyAndSell.province;
                    this.tag = buyAndSell.tag;
                    this.contact = buyAndSell.contact;

                    if (buyAndSell.files.length) {
                        this.files = buyAndSell.files;
                    }
                    if( buyAndSell.tag.length && buyAndSell.province!= 'all' ) this.getCities();

                }, e => this.app.warning(e));
        }

    }

    onClickProvince() {
        // console.log('Province::', this.province);
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
        }, () => {
        });
    }

    get cityKeys() {
        return Object.keys(this.cities);
    }

    onClickSubmit() {

        this.errorMessage = null;
        if (!this.tag && !this.tag.length) {
            this.app.warning( error(-90031,'*tag is required'));
            return this.errorMessage = '*tag is required';
        }
        if (this.province == 'all') {
            this.app.warning( error(-90032,'*Province is required'));
            return this.errorMessage = '*Province is required';
        }
        if (!this.price) {
            this.app.warning( error(-90033,'*price is required'));
            return this.errorMessage = '*price is required';
        }
        if (!this.title && !this.title.length) {
            this.app.warning( error(-90034,'*title is required'));
            return this.errorMessage = '*title is required';
        }
        if (!this.description && !this.description.length) {
            this.app.warning(error(-90035, '*description is required'));
            return this.errorMessage = '*description is required';
        }
        if (!this.contact && !this.contact.length) {
            this.app.warning(error(-90036, '*contact information is required'));
            return this.errorMessage = '*contact information is required';
        }


        this.loading = true;
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

            this.loading = false;
            this.app.alert.open({ content: this.app.text('saved'), class: 'buyandsell-success' });
            this.router.navigateByUrl('/buyandsell');
        }, e => {
            this.loading = false;
            this.app.warning(e);
            this.errorMessage = this.app.getErrorString(e);
        });

    }

}
