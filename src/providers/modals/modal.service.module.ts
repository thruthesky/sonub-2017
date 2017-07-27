import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalService } from './confirm/confirm.modal';
import { ConfirmContent } from './confirm/confirm.content';

/// Ng Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [],
    declarations: [
        ConfirmContent
    ],
    entryComponents: [
        ConfirmContent
    ],
    providers: [
        ConfirmModalService
    ],
})
export class ModalServiceModule { }
