import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
import { CHAT_ROOM, CHAT_MESSAGE, CHAT_USER } from './../../../../providers/chat.service';
import { Base } from './../../../../etc/base';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'chat-unread-page',
    templateUrl: 'chat-unread.html'
})

export class ChatUnreadPage extends Base implements OnInit, OnDestroy {

    rooms: Array<CHAT_ROOM> = [];
    onObserveMyRooms = null;
    onUsers = {};
    loginSubscription: Subscription;
    constructor(
        public app: AppService
    ) {
        super();
        this.loginSubscription = app.firebaseAuthChange.subscribe(login => {
            if (login) {
                this.observeUnreadMessages();
            }
        });

        
    }

    ngOnInit() { }
    ngOnDestroy() {
        if ( this.loginSubscription ) this.loginSubscription.unsubscribe();
        this.unObserveUsers();
        this.unObserveMyRooms();
    }



    unObserveMyRooms() {
        // debugger;
        if ( this.onObserveMyRooms && this.app.chat.myRooms ) {
            this.app.chat.myRooms.off('value', this.onObserveMyRooms);
            this.onObserveMyRooms = null;
        }
    }

    /**
     * Do not observe all chat users.
     */
    unObserveUsers() {
        // console.log("unObserveUsers()");
        if (this.onUsers && Object.keys(this.onUsers).length) {
            for (let uid of Object.keys(this.onUsers)) {
                // console.log(`uid: ${uid} has been un-observed`);
                let on = this.onUsers[uid];
                // console.log('on', on);
                this.referenceUser(uid).off('value', on);
            }
        }
    }


    
    observeUnreadMessages() {
        let a = this.app;
        this.unObserveMyRooms();
        this.onObserveMyRooms = a.chat.myRooms.orderByChild('stamp_read').equalTo(0).on('value', snap => {
            let rooms = snap.val();
            if (rooms === null || Object.keys(rooms).length == 0) {
                return;
            }

            ////
            this.rooms = [];
            this.unObserveUsers();
            for (let key of Object.keys(rooms).reverse()) {
                let room = rooms[key];
                if (room && room['otherUid']) {
                    this.rooms.push(room);
                    let on = this.referenceUser(room['otherUid']).on('value', snap => {
                        let user: CHAT_USER = snap.val();
                        // console.log("observe user: ", user);
                        if (user === null) return;
                        let found = this.rooms.findIndex((room: CHAT_ROOM) => room.otherUid == snap.key);
                        // console.log('found: ', found);
                        if (found != -1) {
                            this.rooms[found].otherStatus = user.status;
                        }
                        a.rerenderPage();
                    });
                    this.onUsers[room['otherUid']] = on;
                }
            }

        });
    }


}