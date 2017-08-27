import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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

export class ChatPage implements OnInit, AfterViewInit, OnDestroy {
    message = '';
    // otherFirebaseUid = '';
    // otherFirebaseProfile;
    // other: CHAT_PROFILE;
    _me: CHAT_PROFILE;
    chats: Array<CHAT_MESSAGE>;

    /// chat room
    showChatUsers = false;
    rooms: Array<CHAT_ROOM> = [];


    /// onObserveChat
    onObserveChat;


    ///
    firebaseLogin: boolean = false;

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
                    // this.other = obj;
                    app.chatUser = obj;

                    // console.log("my firebse uid: ", app.auth.currentUser.uid);
                    // console.log("other user firebase uid: ", key);
                    // console.log("firebase uid:", this.other.key);

                    this.observeChat();


                    /**
                     * Set current room 'read'
                     */
                    this.room(key).once('value', snap => {
                        let room = snap.val();
                        console.log("room: ", room);
                        let keys = Object.keys(room);
                        let key = keys[0];
                        console.log("room key: ", key);
                        app.chatRooms.child(key).update({ stamp_read: (new Date).getTime() })
                            .then(a => {
                                /// set current room read and update chat
                                app.initChat(); // re do chat updates - new message display, etc.
                            });
                    });
                }, e => console.error(e));
            }
        });


        app.firebaseAuthChange.subscribe(login => {
            this.firebaseLogin = login;
            console.log("login: ", login);
        });


    }

    ngOnInit() { }
    ngOnDestroy() {
        this.unObserveChat();
        this.app.chatUser = null;
    }
    ngAfterViewInit() {
        if (this.app.user.isLogout) {
            this.app.warning(this.app.e.LOGIN_FIRST);
        }
    }


    unObserveChat() {
        if (this.onObserveChat) {
            this.myChatRoom.off('value', this.onObserveChat);
            this.onObserveChat = null;
        }
    }
    observeChat() {

        let a = this.app;           /// app
        let p = this.myChatRoom;       /// other room path
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
            this.app.rerenderPage();
        });
    }


    get myChatRoom(): firebase.database.Reference {
        if (this.app.auth.currentUser) {
            let path = `chat/message/${this.app.auth.currentUser.uid}/${this.roomId}`;
            return this.app.db.child(path);
        }
        else return null;
    }

    get otherChatRoom(): firebase.database.Reference {
        if (this.app.chatUser && this.app.chatUser.key) {
            let path = `chat/message/${this.app.chatUser.key}/${this.roomId}`;
            return this.app.db.child(path);
        }
        else return null;
    }


    /**
     * Returns reference of my rooms node path or null.
     */
    get myRooms(): firebase.database.Reference {
        return this.app.chatRooms;
    }

    get otherRooms() {
        if (this.app.chatUser && this.app.chatUser.key) {
            let path = `chat/rooms/${this.app.chatUser.key}`;
            return this.app.db.child(path);
        }
        else return null;
    }

    /**
     * Get a room's query.
     * @param uid - firebase user uid
     * @return Returns firebase database query of a chat room info.
     * 
     */
    room(uid: string): firebase.database.Query {
        let p = this.myRooms;       /// my room path
        if (p) return p.orderByChild('otherUid').equalTo(uid);
        else return null;
    }


    onEnterMessage() {

        let a = this.app;           /// app
        let p = this.myChatRoom;       /// other room path
        if (p === null) return a.warning(a.e.CHAT_ROOM_PATH);

        console.log("message: ", this.message);
        let data: CHAT_MESSAGE = {
            message: this.message,
            name: this.app.user.name,
            time: (new Date).getTime(),
            xapiUid: this.app.user.id,
            photoUrl: this.app.user.photoURL
        };
        p.push().set(data).then(a => { // send chat to myself. if success, send it to backend.
            this.updateMyRoom(data);
            this.updateOtherRoom(data);
            /**
             * 
             * @todo from here
             * 
             */
            /// if the user is not online, send push message.

        });

        this.otherChatRoom.push().set(data); // send to other.
        this.message = '';
    }

    get roomId(): string {
        return [this.app.user.id, this.app.chatUser.xapiUid].sort().join('-');
    }



    onClickRecentChatUsers() {
        this.rooms = [];
        this.showChatUsers = !this.showChatUsers;
        if (this.myRooms === null) return this.app.warning(this.app.e.CHAT_ROOM_PATH);
        this.myRooms.once('value', snap => {
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


    /**
     * Updates my chat rooms (list) info
     * 
     * @param data Chat data
     * 
     * @logic
     *          1. delete if previous room info exists.
     *          2. push room info.
     *              ==> In this way, rooms with newly chat will be listed in order.
     */
    updateMyRoom(data) {
        let a = this.app;           /// app
        let p = this.myRooms;       /// my room path
        if (p === null) return a.warning(a.e.CHAT_ROOM_PATH);

        let myRoomInfo = {
            message: data.message,
            other: this.app.chatUser,
            otherUid: this.app.chatUser.key,
            stamp_last_message: (new Date).getTime(),
            stamp_read: (new Date).getTime()
        };
        // console.log("other key:", this.other.key);

        /// 1. get previous room(s).
        p.orderByChild('otherUid').equalTo(this.app.chatUser.key).once('value', snap => {
            let rooms = snap.val();
            // console.log("snap.val(): ", rooms);

            /// 2. (attention) set new chat (by create a new room node ) first to avoid double 'child_added' event
            /// 3. delete after set. In this way, you can avoid 'double child_added event'
            p.push().set(myRoomInfo).then(a => this.deleteRooms(p, rooms));

        }, e => console.error(e));
    }

    updateOtherRoom(data) {

        let a = this.app;           /// app
        let p = this.otherRooms;       /// other room path
        if (p === null) return a.warning(a.e.CHAT_ROOM_PATH);

        let otherRoomInfo = {
            message: data.message,
            other: this.me,
            otherUid: this.me.key,
            stamp_last_message: (new Date).getTime(),
            stamp_read: 0
        };
        p.orderByChild('otherUid').equalTo(this.me.key).once('value', snap => {
            let rooms = snap.val();
            console.log("snap.val(): ", rooms);
            p.push().set(otherRoomInfo).then(a => this.deleteRooms(p, rooms));
        }, e => console.error(e));

    }

    deleteRooms(p, rooms) {

        if (!rooms) return;
        /// 3. If there is room(s), then delete.
        ///         if there is key(s), then, remove previously recorded room info.
        let keys = Object.keys(rooms);
        /**
         * @todo improve this with async/await
         */
        for (let key of keys) {
            p.child(key).set(null).then(a => {
                console.log("previous room deleted. key: ", key);
            });
        }

    }
}
