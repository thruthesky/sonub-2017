import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalService } from './confirm/confirm.modal';
import { ConfirmContent } from './confirm/confirm.content';

/// Ng Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertModalService } from './alert/alert.modal';
import { AlertContent } from './alert/alert.content';



@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [],
    declarations: [
        ConfirmContent,
        AlertContent
    ],
    entryComponents: [
        ConfirmContent,
        AlertContent
    ],
    providers: [
        ConfirmModalService,
        AlertModalService
    ],
})
export class ModalServiceModule { }
