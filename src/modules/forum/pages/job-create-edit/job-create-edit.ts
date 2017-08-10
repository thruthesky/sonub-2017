import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService, POST, FILES, FILE, POST_CREATE } from './../../../../providers/app.service';
import {USER_UPDATE} from "../../../../providers/wordpress-api/interface";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { DATEPICKER } from "../../../../etc/interface";
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'job-create-edit-page',
    templateUrl: 'job-create-edit.html'
})

export class JobCreateEditPage implements OnInit, OnDestroy {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    title: string =  'Job Post Title';  // generate base on the given info
    content: string = 'Job Post Content';  // personal message
    char_1: string = 'm'; // Gender
    varchar_1: string = 'driver'; // profession
    varchar_2: string = 'all'; // province
    varchar_3: string = 'all'; // city
    int_1: number = 0; // work experience

    birthday: DATEPICKER;

    mobile: string = ''; // mobile meta
    firstName: string = ''; // first name meta
    middleName: string = ''; // middle name meta
    lastName: string = ''; // last name meta
    address: string = ''; // address meta

    files: FILES = [];
    file: FILE;
    ID;

    provinces: Array<string> = [];
    cities = [];
    showCities: boolean = false;

    now = (new Date());

    numbers = Array.from(new Array(20), (x,i) => i+1);

    constructor(
        private region: PhilippineRegion,
        private activeRoute: ActivatedRoute,
        public app: AppService,
        dateConfig: NgbDatepickerConfig,

    ) {
        region.get_province( re => {
            this.provinces = re;
        }, e => {
        });

        dateConfig.minDate = {year: 1956, month: 1, day: 1};
        dateConfig.maxDate = {year: this.now.getFullYear(), month: 12, day: 31};

    }

    ngOnInit() {}

    ngOnDestroy() {}

    get cityKeys() {
        return Object.keys( this.cities );
    }


    onClickSubmit() {

        let data: POST_CREATE = {
            category: 'jobs',
            post_title: '',
            post_content: this.content,     // personal message
            char_1: this.char_1,            // gender
            varchar_1: this.varchar_1,      // profession
            varchar_2: this.varchar_2,      // province
            varchar_3: this.varchar_3,      // city
            varchar_4: this.firstName + ' ' + this.middleName + ' ' + this.lastName,
            int_1: this.int_1,              // work experience
            int_2: parseInt( this.birthday.year + this.app.add0(this.birthday.month) + this.app.add0(this.birthday.day) ) // birthday
        };
        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);
        data['ID'] = this.ID;

        console.log('onClickSubmit::data:: ', data);
        this.app.forum.postCreate(data).subscribe(res => {
            console.log("job create: ", res);
            this.app.alert.open({ content: this.app.text('saved') });
        }, e => this.app.warning(e));

    }

    onSuccessUpdateJobProfile() {
        console.log("onSuccessUpdateJobProfile::", this.files);
        if( this.files.length > 1 ) {
            if( this.files && this.files[0] && this.files[0].id ) setTimeout( () => this.fileUploadComponent.deleteFile( this.files[0]) );
        }
    }


    onClickProvince() {
        console.log('Province::', this.varchar_2);
        if( this.varchar_2 != 'all') {
            this.varchar_3 = this.varchar_2;
            this.getCities();
        }
        else {
            this.varchar_3 = 'all';
            this.showCities = false;
        }
    }


    getCities() {
        this.region.get_cities( this.varchar_2, re => {
            if(re) {
                this.cities = re;
                this.showCities = true;
            }
        }, e => {
        });
    }

    onChangeBirthday() {
        console.log(this.birthday);
    }

}
