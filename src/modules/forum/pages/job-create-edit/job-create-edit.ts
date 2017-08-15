import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService, POST, FILES, FILE, POST_CREATE } from './../../../../providers/app.service';
import { JOB_CREATE } from "../../../../providers/wordpress-api/interface";
import { FileUploadWidget } from "../../../../widgets/file-upload/file-upload";
import { PhilippineRegion } from "../../../../providers/philippine-region";
import { DATEPICKER } from "../../../../etc/interface";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";



@Component({
    selector: 'job-create-edit-page',
    templateUrl: 'job-create-edit.html'
})

export class JobCreateEditPage implements OnInit, OnDestroy {

    @ViewChild('fileUploadWidget') public fileUploadComponent: FileUploadWidget;

    message: string = '';  // personal message
    gender: string = 'm'; // Gender
    profession: string = 'driver'; // profession
    province: string = 'all'; // province
    city: string = 'all'; // city
    experience: number = 0; // work experience
    password: string = '';
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

    today = (new Date());

    numbers = Array.from(new Array(20), (x, i) => i + 1);

    constructor(
        private region: PhilippineRegion,
        private router: Router,
        public app: AppService,
        dateConfig: NgbDatepickerConfig,

    ) {
        region.get_province(re => {
            this.provinces = re;
        }, e => {
        });

        dateConfig.minDate = { year: 1956, month: 1, day: 1 };
        dateConfig.maxDate =  { year: this.today.getFullYear() - 14, month: 12, day: 31 };
        this.birthday = { year: this.today.getFullYear() - 14, month: 12, day: 31 };


    }

    ngOnInit() { }

    ngOnDestroy() { }

    get cityKeys() {
        return Object.keys(this.cities);
    }


    onClickSubmit() {

        if( this.experience) {
            console.log('data::', this.experience);
        }


        let data: JOB_CREATE = {
            message: this.message,
            gender: this.gender,
            profession: this.profession,
            province: this.province,
            city: this.city,
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName,
            experience: this.experience,
            birthday: parseInt(this.birthday.year + this.app.add0(this.birthday.month) + this.app.add0(this.birthday.day)), // birthday
            mobile: this.mobile,
            address: this.address,
            password: this.password
        };
        data.fid = this.files.reduce((_, file) => { _.push(file.id); return _; }, []);

        console.log('onClickSubmit::data:: ', data);
        this.app.job.create(data).subscribe(res => {
            console.log("job create: ", res);
            this.app.alert.open({ content: this.app.text('saved') });
            this.router.navigateByUrl('/job');
            // this.app.forum.postData(res).subscribe((post: POST) => {
            //     console.log("created job: ", post);
            // }, e => this.app.warning(e));
        }, e => this.app.warning(e));

    }

    onSuccessUpdateJobProfile() {
        console.log("onSuccessUpdateJobProfile::", this.files);
        if (this.files.length > 1) {
            if (this.files && this.files[0] && this.files[0].id) setTimeout(() => this.fileUploadComponent.deleteFile(this.files[0]));
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


}
