import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription'
// import 'rxjs/add/observable/fromEvent';
// import 'rxjs/add/observable/timer';
// import 'rxjs/add/operator/throttleTime';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';



import * as firebase from 'firebase/app';

import { WordpressApiService } from './wordpress-api/wordpress-api.service';
import { UserService } from './../providers/wordpress-api/user.service';
import { ShareService } from './share.service';


import { Base } from './../etc/base';


export interface CHAT_MESSAGE {
    name: string;
    message: string;
    otherUid: string; // Chat Sender Uid ( Other user's firebase auth uid. )
    photoUrl: string;
    time: number;
};

export interface CHAT_ROOM {
    message: string;
    stamp_last_message: number;
    stamp_read: number;

    /// Chat sender( other user )
    otherUid: string;
    otherName: string;
    otherPhotoUrl: string;
    otherXapiUid: string;
    otherStatus: string; /// this only exists on chat page class.
};


/// firebase database /users
export interface CHAT_USER {
    uid: string;
    name: string;
    photoUrl: string;
    status: string;
    lastOnline: number;
    xapiUid: string;
};


@Injectable()
export class ChatService extends Base {


    /// injections
    auth: firebase.auth.Auth;
    db: firebase.database.Reference;
    user: UserService;
    wp: WordpressApiService;

    /**
     * This event is trigged when any chat room updates ( by observing all rooms )
     * If there is any new message in any chat rooms, other user's firebase uid will be returned.
     * null if there is no new message.
     */
    roomsEvent = new BehaviorSubject<string>(null);
    onRooms;
    my: CHAT_USER;
    other: CHAT_USER; /// whom i am chatting with.



    constructor(
        private share: ShareService
    ) {
        super();
    }
    inject(auth, db, user, wp) {
        this.auth = auth;
        this.db = db;
        this.user = user;
        this.wp = wp;
    }

    /**
     * Logs into firebase.
     * @note This method is being invoked when a user logs into firebase.
     */
    onFirebaseLogin() {
        this.observeChat();
        this.initChat();
        this.updateMyInfo();
    }
    /**
     * Logs out from firebase.
     */
    onFirebaseLogout() {
        this.destroyChat();
    }
    onDestroyChatPage() {
        this.other = null; /// this is for receiving new messages.
    }
    destroyChat() {
        this.unObserveChat(); /// remove memory leak.
        this.other = null; /// this is for receiving new messages.
        this.my = null;
    }

    updateMyInfo() {
        if (this.login) {
            this.db.child("users").child(this.uid).once('value', x => this.my = x.val());
        }
        this.my = null;
    }


    /**
     * Returns a string if the user logged into firebase.
     * @return  - a string if logged in
     *          - null if not logged in.
     */
    get login(): string {
        return this.share.isFirebaseLogin;
    }
    get uid(): string {
        return this.share.firebaseUid;
    }

    // get my(): CHAT_USER {
    //     // if (this.login) return this.auth.currentUser;
    //     // else return null;
    // }

    get otherUid(): string {
        if (this.other && this.other.uid) return this.other.uid;
        else return null;
    }
    get otherXapiUid(): string {
        if (this.other && this.other.xapiUid) return this.other.xapiUid;
        else return null;
    }

    get myUid(): string {
        return this.uid;
    }
    get myName(): string {
        if (this.my && this.my.name) return this.my.name;
        else return null;
    }
    get myPhotoUrl(): string {
        if (this.my && this.my.photoUrl) return this.my.photoUrl;
        else return null;
    }
    get xapiUid(): string {
        if (this.my && this.my.xapiUid) return this.my.xapiUid;
        else return null;
    }



    /**
     * Returns reference of my all chat rooms node or null.
     */
    get rooms(): firebase.database.Reference {
        if (this.login) {
            let path = `chat/rooms/${this.uid}`;
            // console.log("path: ", path);
            return this.db.child(path);
        }
        else return null;
    }




    /**
     * Returns a Reference of a room ( among all my rooms )
     * @param uid - firebase (other) user uid
     * @return Returns a reference of a room or null.
     * 
     */
    room(uid: string): firebase.database.Query {
        if (!uid) return null;
        let p = this.myRooms;       /// my room path
        if (p) return p.orderByChild('otherUid').equalTo(uid);
        else return null;
    }




    /**
     * Observe new chats ( by oserving all rooms )
     */
    observeChat() {
        if (this.rooms === null) return;
        // console.log("Observe count: ");
        this.unObserveChat();
        this.onRooms = this.rooms.orderByKey().limitToLast(1).on('child_added', snap => {
            let chat = snap.val();
            // console.log('observeChat() => snap.val: chat: ', chat);
            // console.log("this.other: ", this.other);
            if (chat && chat['stamp_read'] === 0) {
                this.roomsEvent.next(chat['otherUid']);
            }
            else this.roomsEvent.next(null);
        });
    }


    /**
     * This must be called when logout.
     */
    unObserveChat() {
        if (this.onRooms && this.rooms) {
            console.log("UnObserve count: ");
            this.rooms.off('child_added', this.onRooms);
            this.onRooms = null;
            this.roomsEvent.next(null);
        }
    }



    /**
     * 
     * This method initialize and check ups for chat room.
     * 
     * 
     * 
     * @note this method should be called when
     *  
     *      - a user logs in.
     *      - a user opens chat room
     * 
     */
    initChat() {
        /**
         * Generate 'roomsEvent' if there is any new messages.
         * 
         */
        this.rooms.orderByChild('stamp_read').equalTo(0).limitToLast(1).once('value', snap => {
            if (snap.val()) {
                let val = snap.val();
                let keys = Object.keys(val);
                let room = val[keys[0]];
                // console.log("initChat() : room : ", room);
                this.roomsEvent.next(room['otherUid']);
            }
            else {
                this.roomsEvent.next(null);
            }
        })
    }




    /**
     * Returns reference of all my rooms node or null.
     */
    get myRooms(): firebase.database.Reference {
        return this.rooms;
    }

    /**
     * Returns All Rooms Reference of other user.
     */
    get otherRooms() {
        if (this.otherUid) {
            let path = `chat/rooms/${this.otherUid}`;
            return this.db.child(path);
        }
        else return null;
    }


    



    /**
     * Returns Reference of a chat room that I am currently in. ( that I am currently in and chatting with other)
     * 
     */
    get myCurrentRoom(): firebase.database.Reference {
        if (this.uid && this.otherUid) {
            let path = `chat/message/${this.uid}/${this.otherUid}`;
            return this.db.child(path);
        }
        else return null;
    }


    /**
     * Returns other's chat room Reference ( that the room is currently chatting with me. )
     */
    get otherCurrentRoom(): firebase.database.Reference {
        if (this.otherUid) {
            let path = `chat/message/${this.otherUid}/${this.uid}`;
            return this.db.child(path);
        }
        else return null;
    }





    /**
     * Updates my chat rooms TO indicate there is a new message.
     * 
     * @param data Chat data
     * 
     * @logic
     *          1. delete if previous room info exists.
     *          2. push room info.
     *              ==> In this way, rooms with newly chat will be listed in order.
     */
    updateMyRoom(data) {

        let p = this.rooms;       /// my room path
        if (p === null) return console.error('no my room path');
        if (!this.other) return null;

        let myRoomInfo = {
            message: data.message,
            otherUid: this.other.uid,
            otherName: this.other.name,
            otherPhotoUrl: this.other.photoUrl,
            otherXapiUid: this.other.xapiUid,
            stamp_last_message: (new Date).getTime(),
            stamp_read: (new Date).getTime()
        };
        // console.log("other key:", this.other.key);

        /// 1. get previous room(s).
        p.orderByChild('otherUid').equalTo(this.otherUid).once('value', snap => {
            let rooms = snap.val();
            // console.log("snap.val(): ", rooms);

            /// 2. (attention) set new chat (by create a new room node ) first to avoid double 'child_added' event
            /// 3. delete after set. In this way, you can avoid 'double child_added event'
            p.push().set(myRoomInfo).then(a => this.deleteRooms(p, rooms));

        }, e => console.error(e));
    }

    /**
     * Update other's room TO indicate there is a new message.
     * @param data chat data
     */
    updateOtherRoom(data) {
        if (!this.myUid) return console.error("my uid is wrong: ", this.my);
        let p = this.otherRooms;       /// other room path
        if (p === null) return console.error("no other room path");

        let otherRoomInfo = {
            message: data.message,
            otherUid: this.myUid,
            otherName: this.myName,
            otherPhotoUrl: this.myPhotoUrl,
            otherXapiUid: this.user.id,
            stamp_last_message: (new Date).getTime(),
            stamp_read: 0
        };
        p.orderByChild('otherUid').equalTo(this.myUid).once('value', snap => {
            let rooms = snap.val();
            // console.log("updateOtherRoom: snap.val(): ", rooms);
            p.push().set(otherRoomInfo).then(a => this.deleteRooms(p, rooms));
        }, e => console.error(e));

    }

    /**
     * 
     * @param p Path of a rooms ( it may be login user's room path or the other user's room path. )
     * @param rooms Rooms to delete.
     */
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
                // console.log("previous room deleted. key: ", key);
            });
        }

    }



    setCurrentRoomAsRead(uid) {
        /**
         * Set current room 'read'
         */
        this.room(uid).once('value', snap => {
            let rooms = snap.val();
            if (!rooms) return;
            // console.log("room() snap.val(): ", rooms);
            let keys = Object.keys(rooms);
            let key = keys[0];
            // console.log("room key: ", key);
            this.rooms.child(key).update({ stamp_read: (new Date).getTime() })
                .then(a => {
                    /// set current room read and update chat
                    this.initChat(); // re do chat updates - new message display, etc.
                });
        });
    }



    pushMessage(xapiUid, c: CHAT_MESSAGE) {
        this.queryUserByXapiUid(xapiUid).once('value', snap => {
            let val = snap.val();
            if (!val) return console.error(`No user exists on firebase database /user/xxxx/xapiUid=${xapiUid}`);
            let keys = Object.keys(val);
            if (keys.length == 0) return console.error(`No user from firebase /users/xxxx/xapiUid=${xapiUid}`);
            let user: CHAT_USER = val[keys[0]];
            // console.log("user: ", user);
            if (user.status === void 0 || user.status == 'online') return;

            /// if user is not online, send push
            let data = {
                route: 'wordpress.push',
                ID: xapiUid,
                body: c.message,
                title: c.name + ' says ...',
                click_action: this.homeUrl
            }
            this.wp.post(data).subscribe(res => {
                // console.log("pushMessage(): success: uid: ", res);
            }, e => console.error("pushMessage: error: ", e));

        });
    }
}