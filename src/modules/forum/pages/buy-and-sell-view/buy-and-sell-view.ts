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
        if (buyAndSell.usedItem == 'y') buyAndSell['used'] = 'Yes';
        if (buyAndSell.usedItem == 'n') buyAndSell['used'] = 'No';
        if (buyAndSell.usedItem == 'x') buyAndSell['used'] = 'Not Applicable';
        if (buyAndSell.deliverable == 'y') buyAndSell['delivery'] = 'Yes';
        if (buyAndSell.deliverable == 'n') buyAndSell['delivery'] = 'No';
    }


    onClickUpdate(ID) {
        this.router.navigateByUrl('/buyandsell/edit/', ID);
    }



}
