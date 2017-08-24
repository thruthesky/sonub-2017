import { Component, OnInit } from '@angular/core';
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
    room_id: string;
    message: string;
    stamp: number;
    user: {             /// this is the other user.
        ID: string;
        name: string;
        photoURL: string;
    };
}

@Component({
    selector: 'chat-page',
    templateUrl: 'chat.html'
})

export class ChatPage implements OnInit {
    message = '';
    otherFirebaseUid = '';
    otherXapiUid = 0;
    chats: Array<CHAT_MESSAGE>;

    /// chat room
    showChatUsers = false;
    rooms: Array<CHAT_ROOM> = [];
    constructor(
        private active: ActivatedRoute,
        public app: AppService
    ) {

        active.params.subscribe(params => {
            if ( params['id'] ) {
                if ( params['id'] == app.user.id ) return app.warning(-8300, "You cannot chat with yourself");
                this.otherXapiUid = params['id'];
                app.db.child('xapi-uid').child( params['id'] ).once('value', snap => {
                    if ( snap.val() ) {
                        let val = snap.val();
                        this.otherFirebaseUid = val['uid'];
                        console.log("uid:", this.otherFirebaseUid);

                        this.observeChat();
                    }
                    else {
                        /// error
                        app.warning(-8088, 'Wrong user. User Xapi ID does not exist on firebase.');
                    }
                });
            }
        });


        this.onClickChatUsers();

    }

    ngOnInit() { }


    observeChat() {

        this.app.db.child( this.myPath ).limitToLast( 10 ).on('value', snap => {
            if ( snap.val() === null ) {
                /// error
                return
            }
            let val = snap.val();
            console.log("observeChat() snap.val: ", val);
            let keys = Object.keys(val);
            this.chats = [];
            for( let key of keys.reverse() ) {
                this.chats.push( val[key] );
            }
            console.log( this.chats );
            this.app.rerenderPage();
        });
    }

    get myPath() {
        return `chat/message/${this.app.auth.currentUser.uid}/${this.roomId}`;
    }
    get otherPath() {
        return `chat/message/${this.otherFirebaseUid}/${this.roomId}`;
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
        this.app.db.child( this.myPath ).push().set( data ).then( a => { // send chat to myself. if success, send it to backend.
            let chat_message = {
                route: 'wordpress.chat_message',
                room_id: this.roomId,
                message: data.message
            };
            this.app.wp.post(chat_message).subscribe( res => {
                console.log("chat message: ", res);
            }, e => this.app.warning(e) );
        });

        this.app.db.child( this.otherPath ).push().set( data ); // send to other.
        this.message = '';
    }

    get roomId(): string {
        return [ this.app.user.id, this.otherXapiUid ].sort().join('-');
    }



    onClickChatUsers() {
        this.showChatUsers = true;
        this.app.wp.post({ route: 'wordpress.chat_room', session_id: this.app.user.sessionId }).subscribe( res => {
            console.log("chat rooms: ", res);
            this.rooms = res;
        }, e => this.app.warning(e));
    }
}
