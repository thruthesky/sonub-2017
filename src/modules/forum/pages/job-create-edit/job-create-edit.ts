import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService, ERROR, FILES, FILE} from './../../../../providers/app.service';
import {JOB_CREATE, JOB} from "../../../../providers/wordpress-api/interface";
import {FileUploadWidget} from "../../../../widgets/file-upload/file-upload";
import {PhilippineRegion} from "../../../../providers/philippine-region";
import {DATEPICKER} from "../../../../etc/interface";
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'job-create-edit-page',
    templateUrl: 'job-create-edit.html'
})

export class JobCreateEditPage {

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
    text: any = {};

    constructor(private region: PhilippineRegion,
                private router: Router,
                public app: AppService,
                private activeRoute: ActivatedRoute,
                dateConfig: NgbDatepickerConfig,) {
        app.section('job');
        region.get_province(re => {
            this.provinces = re;
        }, () => {
        });


        let codes = [
            'job_edit_create',
            'job_edit_create_desc',
        ];
        app.wp.text(codes, re => this.text = re);

        dateConfig.minDate = {year: 1946, month: 1, day: 1};
        dateConfig.maxDate = {year: this.today.getFullYear() - 14, month: 12, day: 31};
        this.birthday = {year: this.today.getFullYear() - 14, month: 12, day: 31};


        let params = activeRoute.snapshot.params;
        if (params['id']) {
            this.app.job.data({route: 'wordpress.get_post', ID: params['id']})
                .subscribe((job: JOB) => {
                    if (job.author.ID) {
                        if (!app.user.isLogin) {
                            this.app.warning(ERROR.LOGIN_FIRST);
                            this.router.navigateByUrl('/user/login');
                            return;
                        }
                        else if (job.author.ID != app.user.id) {
                            this.app.warning(ERROR.CODE_PERMISSION_DENIED_NOT_OWNER);
                            this.router.navigateByUrl('/job');
                            return;
                        }
                    }

                    this.ID = job.ID;
                    this.message = job.message;
                    this.gender = job.gender;
                    this.firstName = job.first_name;
                    this.middleName = job.middle_name;
                    this.lastName = job.last_name;
                    this.mobile = job.mobile;
                    this.address = job.address;
                    this.city = job.city;
                    this.province = job.province;
                    this.profession = job.profession;
                    this.experience = job.experience;
                    this.birthday = this.birthdayData(job.birthday);
                    if (job.files.length) {
                        this.files[0] = job.files[0];
                        this.file = job.files[0];
                    }

                    if (job.city != 'all') this.getCities();
                }, e => this.app.warning(e));
        }


    }


    birthdayData(birthday) {
        if (birthday) return {
            year: parseInt(birthday.substring(0, 4)),
            month: parseInt(birthday.substring(4, 6)),
            day: parseInt(birthday.substring(6, 8))
        };
    }

    onClickSubmit() {





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
        data.fid = this.files.reduce((_, file) => {
            _.push(file.id);
            return _;
        }, []);
        data['ID'] = this.ID;

        console.log('onClickSubmit::data:: ', data);
        this.app.job.create(data).subscribe(res => {
            console.log("job create: ", res);
            this.app.alert.open({content: this.app.text('saved')});
            this.router.navigateByUrl('/job');
        }, e => this.app.warning(e));

    }

    onSuccessUpdateJobProfile() {
        console.log("onSuccessUpdateJobProfile::", this.files);
        if (this.files.length > 1) {
            if (this.files && this.files[0] && this.files[0].id) setTimeout(() => this.fileUploadComponent.deleteFile(this.files[0]));
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


}
