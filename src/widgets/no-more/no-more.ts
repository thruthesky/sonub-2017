import { Component, Input, OnInit } from '@angular/core';
import { text } from './../../etc/text';

@Component({
    selector: 'no-more-widget',
    templateUrl: 'no-more.html'
})

export class NoMoreWidget implements OnInit {
    @Input() text = text('no_more_data');
    constructor() { }

    ngOnInit() { }
}