import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../../providers/app.service';
import { ActivatedRoute } from '@angular/router';



interface CHAT_MESSAGE {
    name: string;
    message: string;
    time: number;
    xapiUid: number; // xapi uid. Not firebase auth user id.
    photoUrl: string;
};

interface CHAT_ROOM {
    message: string;
    stamp_last_message: number;
    stamp_read: number;
    other: {             /// this is the other user.
        key: string;
        name: string;
        email: string;
        photoUrl: string;
        status: string;
        xapiUid: number;
    };
    otherUid: string;
}

interface CHAT_PROFILE {
    key: string;
    email: string;
    name: string;
    photoUrl: string;
    status: string;
    xapiUid: number;
};

@Component({
    selector: 'chat-page',
    templateUrl: 'chat.html'
})

export class ChatPage implements OnInit, OnDestroy {
    message = '';
    // otherFirebaseUid = '';
    // otherFirebaseProfile;
    other: CHAT_PROFILE;
    _me: CHAT_PROFILE;
    chats: Array<CHAT_MESSAGE>;

    /// chat room
    showChatUsers = false;
    rooms: Array<CHAT_ROOM> = [];


    /// onObserveChat
    onObserveChat;

    constructor(
        private active: ActivatedRoute,
        public app: AppService
    ) {


        active.params.subscribe(params => {
            if (params['id']) {
                if (params['id'] == app.user.id) return app.warning(-8300, "You cannot chat with yourself");
                let uid = parseInt(params['id']);
                console.log("otherXapiUid: ", uid);
                app.db.child('users').orderByChild('xapiUid').equalTo(uid).once('value', snap => {
                    let val = snap.val();
                    if (!val) return app.warning(-8090, "User not exists on chat server");
                    console.log(val);

                    let keys = Object.keys(val);
                    let key = keys[0];
                    let obj = val[key];
                    obj['key'] = key;
                    this.other = obj;

                    console.log("firebase uid:", this.other.key);

                    this.observeChat();
                }, e => console.error(e));
            }
        });


        // this.onClickChatUsers();

    }

    ngOnInit() { }
    ngOnDestroy() {
        this.unObserveChat();
    }


    unObserveChat() {
        if ( this.onObserveChat ) {
            this.app.db.child(this.myPath).off('value', this.onObserveChat);
            this.onObserveChat = null;
        }
    }
    observeChat() {

        this.unObserveChat();
        this.onObserveChat = this.app.db.child(this.myPath).limitToLast(5).on('value', snap => {
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
            this.app.rerenderPage();
        });
    }

    get myPath() {
        return `chat/message/${this.app.auth.currentUser.uid}/${this.roomId}`;
    }
    get otherPath() {
        return `chat/message/${this.other.key}/${this.roomId}`;
    }

    // get myRoomPath() {
    //     return `chat/rooms/${this.app.auth.currentUser.uid}/${this.roomId}`;
    // }
    // get otherRoomPath() {
    //     return `chat/rooms/${this.other.key}/${this.roomId}`;
    // }

    get myRooms() {
        return `chat/rooms/${this.app.auth.currentUser.uid}`;
    }
    get otherRooms() {
        return `chat/rooms/${this.other.key}`;
    }

    onEnterMessage() {
        console.log("message: ", this.message);
        let data: CHAT_MESSAGE = {
            message: this.message,
            name: this.app.user.name,
            time: (new Date).getTime(),
            xapiUid: this.app.user.id,
            photoUrl: this.app.user.photoURL
        };
        this.app.db.child(this.myPath).push().set(data).then(a => { // send chat to myself. if success, send it to backend.


            /// delete preview room info
            let myRoomInfo = {
                message: data.message,
                other: this.other,
                otherUid: this.other.key,
                stamp_last_message: (new Date).getTime(),
                stamp_read: (new Date).getTime()
            };
            console.log("other key:", this.other.key);
            this.app.db.child(this.myRooms).orderByChild('otherUid').equalTo(this.other.key).once('value', snap => {
                let ref = this.app.db.child(this.myRooms).push();
                console.log("snap.val(): ", snap.val());
                if ( snap.val() ) {
                    let val = snap.val();
                    let keys = Object.keys( val );
                    for( let key of keys ) {
                        this.app.db.child( this.myRooms ).child( key ).set(null).then( a => ref.set(myRoomInfo) );
                    }
                }
                else {
                    ref.set(myRoomInfo);
                }
            }, e => console.error(e));



            let otherRoomInfo = {
                message: data.message,
                other: this.me,
                otherUid: this.me.key,
                stamp_last_message: (new Date).getTime(),
                stamp_read: 0
            };
            this.app.db.child(this.otherRooms).orderByChild('otherUid').equalTo(this.me.key).once('value', snap => {
                let ref = this.app.db.child(this.otherRooms).push();
                console.log("snap.val(): ", snap.val());
                if ( snap.val() ) {
                    let val = snap.val();
                    let keys = Object.keys( val );
                    for( let key of keys ) {
                        this.app.db.child( this.otherRooms ).child( key ).set(null).then( a => ref.set(otherRoomInfo) );
                    }
                }
                else {
                    ref.set(otherRoomInfo);
                }
            }, e => console.error(e));



            
            
        });

        this.app.db.child(this.otherPath).push().set(data); // send to other.
        this.message = '';
    }

    get roomId(): string {
        return [this.app.user.id, this.other.xapiUid].sort().join('-');
    }



    onClickChatUsers() {
        this.rooms = [];
        this.showChatUsers = !this.showChatUsers;
        this.app.db.child( this.myRooms ).once('value', snap => {
            if ( ! snap.val() ) {
                return;
            }
            let rooms = snap.val();
            let keys = Object.keys(rooms);
            for( let key of keys.reverse()) {
                this.rooms.push( rooms[key] );
            }
            console.log("rooms: ", rooms);
            // this.rooms = snap.val();
        });
        // this.app.wp.post({ route: 'wordpress.chat_room', session_id: this.app.user.sessionId }).subscribe(res => {
        //     console.log("chat rooms: ", res);
        //     this.rooms = res;
        // }, e => this.app.warning(e));
    }

    /**
     * To avoid initialization error. `this.app.auth.currentUser.uid` is only available after firebase init.
     */
    get me(): CHAT_PROFILE {
        this._me = {
            key: this.app.auth.currentUser.uid,
            email: this.app.user.email,
            name: this.app.user.name,
            photoUrl: this.app.user.photoURL,
            status: 'online',
            xapiUid: this.app.user.id
        };
        return this._me;
    }
}
