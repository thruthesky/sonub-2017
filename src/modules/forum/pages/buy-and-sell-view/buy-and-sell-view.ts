import { Component, OnInit } from '@angular/core';

import { AppService } from "../../../../providers/app.service";
import { BUYANDSELL } from "../../../../providers/wordpress-api/interface";
import { ActivatedRoute, Router } from "@angular/router";



@Component({
    selector: 'buy-and-sell-view-page',
    templateUrl: 'buy-and-sell-view.html'
})

export class BuyAndSellViewPage implements OnInit {

    product: BUYANDSELL;
    used: 'Yes' | 'No' | 'Not Applicable' = 'No';
    deliverable: 'Yes' | 'No' = 'No';
    selectedImage: string;

    ID: number;

    constructor(
        public app: AppService,
        private router: Router,
        private activeRoute: ActivatedRoute
    ) {

        let params = activeRoute.snapshot.params;
        if (params['id']) {

            this.app.bns.data({ route: 'wordpress.get_post', ID: params['id'] })
                .subscribe((buyAndSell: BUYANDSELL) => {
                    console.log('buyAndSell:: ', buyAndSell);
                    this.prepare(buyAndSell);
                    this.product = buyAndSell;
                    if (buyAndSell.files.length) this.selectedImage = buyAndSell.files[0].url;
                }, e => this.app.warning(e));
        }

    }

    ngOnInit() { }

    prepare(buyAndSell: BUYANDSELL) {
        if (buyAndSell.usedItem == 'y') this.used = 'Yes';
        else if (buyAndSell.usedItem == 'n') this.used = 'No';
        else if (buyAndSell.usedItem == 'x') this.used = 'Not Applicable';

        if (buyAndSell.deliverable == 'y') this.deliverable = 'Yes';
        else if (buyAndSell.deliverable == 'n') this.deliverable = 'No';
    }


    onClickUpdate(ID) {
        this.router.navigateByUrl('/buyandsell/edit/', ID);
    }



}
