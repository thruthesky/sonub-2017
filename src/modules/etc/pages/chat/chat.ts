import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../providers/app.service';
import { ChatService, CHAT_ROOM, CHAT_MESSAGE } from './../../../../providers/chat.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'chat-page',
    templateUrl: 'chat.html'
})

export class ChatPage implements OnInit, AfterViewInit, OnDestroy {
    message = '';

    chats: Array<CHAT_MESSAGE>;

    /// chat room
    showChatUsers = false;
    rooms: Array<CHAT_ROOM> = [];

    /// onObserveChat
    onObserveChat;
    

    loginSubscription: Subscription;

    constructor(
        private active: ActivatedRoute,
        public app: AppService,
        public chat: ChatService
    ) {

        this.loginSubscription = app.firebaseAuthChange.subscribe( login => {
            if ( login ) {
                this.run();
            }
        });
    }
    run() {
        if ( this.app.user.isLogout ) {
            return this.app.warning( this.app.e.LOGIN_FIRST );
        }
        this.observeRouteParam();
    }

    observeRouteParam() {
        this.active.params.subscribe(params => {
            if (params['id']) {
                this.openChatRoom( params['id'] );
            }
            else {
                this.onClickRecentChatUsers();
            }
        });
    }


    openChatRoom( xapiUid ) {
        let a = this.app;
        let uid = parseInt( xapiUid );
        if (uid == a.user.id) return a.warning(-8300, "You cannot chat with yourself");
        if ( ! uid ) return a.warning(-80903, "Wrong user id");
        console.log("otherXapiUid: ", uid);
        a.db.child('users').orderByChild('xapiUid').equalTo(uid).once('value', snap => {
            let val = snap.val();
            if (!val) return a.warning(-8090, "User not exists on chat server");
            console.log(val);
            let keys = Object.keys(val);
            let uid = keys[0];
            let user = val[uid];
            user['uid'] = uid;
            this.chat.other = user;
            this.observeChat();
            this.chat.setCurrentRoomAsRead( uid );
        }, e => console.error(e));
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.chat.onDestroyChatPage();
        if ( this.loginSubscription ) this.loginSubscription.unsubscribe();
    }
    ngAfterViewInit() {
        if (this.app.user.isLogout) {
            this.app.warning(this.app.e.LOGIN_FIRST);
        }
    }


    unObserveChat() {
        if (this.onObserveChat) {
            this.chat.myCurrentRoom.off('value', this.onObserveChat);
            this.onObserveChat = null;
        }
    }
    
    observeChat() {
        console.log("observeChat");
        let a = this.app;           /// app
        let p = this.chat.myCurrentRoom;       /// other room path
        if (p === null) return a.warning(a.e.CHAT_ROOM_PATH);

        this.unObserveChat();
        this.onObserveChat = p.limitToLast(5).on('value', snap => {
            if (snap.val() === null) {
                /// error
                return
            }
            let val = snap.val();
            console.log("observeChat() snap.val: ", val);
            let keys = Object.keys(val);
            this.chats = [];
            for (let key of keys.reverse()) {
                this.chats.push(val[key]);
            }
            console.log(this.chats);
            this.app.rerenderPage( 10 );
        });
    }


    onEnterMessage() {

        let a = this.app;           /// app
        if ( ! this.chat.other ) return a.warning( -80901, "No chat user");

        let myRoom = this.chat.myCurrentRoom;       /// my current chat room with other user
        if (myRoom === null) return a.warning(a.e.CHAT_ROOM_PATH);

        console.log("message: ", this.message);
        let data: CHAT_MESSAGE = {
            message: this.message,
            name: this.app.user.name,
            otherUid: this.chat.other.uid,
            photoUrl: this.app.user.photoURL,
            time: (new Date).getTime(),
        };
        myRoom.push().set(data).then(a => { // send chat to myself. if success, send it to backend.
            this.chat.updateMyRoom(data);
            this.chat.updateOtherRoom(data);
            this.chat.pushMessage( this.chat.otherXapiUid, data );
            /**
             * 
             * @todo from here
             * 
             */
            /// if the user is not online, send push message.

        });

        this.chat.otherCurrentRoom.push().set(data); // send to other.
        this.message = '';
    }

    onClickRecentChatUsers() {
        let a = this.app;
        if ( a.user.isLogout ) return a.warning( a.e.LOGIN_FIRST );
        this.rooms = [];
        this.showChatUsers = !this.showChatUsers;
        if (this.chat.myRooms === null) return a.warning(a.e.CHAT_ROOM_PATH);
        this.chat.myRooms.once('value', snap => {
            if (!snap.val()) {
                return;
            }
            let rooms = snap.val();
            let keys = Object.keys(rooms);
            for (let key of keys.reverse()) {
                this.rooms.push(rooms[key]);
            }
            console.log("rooms: ", rooms);
            // this.rooms = snap.val();
        });
        
    }


}
