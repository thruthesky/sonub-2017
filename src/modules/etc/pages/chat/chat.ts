import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../providers/app.service';
import { ChatService, CHAT_ROOM, CHAT_MESSAGE, CHAT_USER } from './../../../../providers/chat.service';
import { Subscription } from 'rxjs/Subscription';
import { Base } from './../../../../etc/base';
import { ShareService } from './../../../../providers/share.service';


@Component({
    selector: 'chat-page',
    templateUrl: 'chat.html'
})

export class ChatPage extends Base implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    message = '';

    chats: Array<CHAT_MESSAGE> = [];
    countChats = 0;

    /// chat room
    showChatUsers = false;
    rooms: Array<CHAT_ROOM> = [];
    chatBoxHeight = 0;
    onObserveMyRooms = null;


    /// onObserveChat
    onObserveChat;

    onUsers = {};

    onObserveChatUser;


    loginSubscription: Subscription;

    constructor(
        private active: ActivatedRoute,
        public app: AppService,
        public chat: ChatService,
        private share: ShareService
    ) {

        super();

        this.loginSubscription = app.firebaseAuthChange.subscribe(login => {
            if (login) {
                this.run();
            }
        });

        app.windowResize.subscribe(re => {
            // console.log("re: ", re);
            this.checkChatBoxHeight();
            this.scrollChatBoxMessagesToBottom();
        });

    }

    ngOnInit() { }

    ngAfterViewChecked() {
        this.scrollChatBoxMessagesToBottom();
    }
    ngOnDestroy() {
        this.unObserveChatUser();
        this.unObserveUsers();
        this.chat.onDestroyChatPage();
        this.unObserveMyRooms();
        if (this.loginSubscription) this.loginSubscription.unsubscribe();
    }
    ngAfterViewInit() {
        if (this.app.user.isLogout) {
            this.app.warning(this.app.e.LOGIN_FIRST);
        }
        setTimeout(() => this.app.getSize(), 1);
    }

    checkChatBoxHeight() {
        setTimeout(() => {
            let div = document.querySelector('section.chat-box');
            if (div) {
                this.chatBoxHeight = div.scrollHeight;
                // console.log("chat box height: ", this.chatBoxHeight);
                this.app.rerenderPage(100);
            }
        }, 10);
    }

    scrollChatBoxMessagesToBottom() {
        if (this.chats && this.chats.length && this.chats.length != this.countChats) {
            this.countChats = this.chats.length;
            let div = document.querySelector('.chat-box-messages');
            if (div) div.scrollTop = div.scrollHeight;
            this.checkChatBoxHeight();
            this.app.rerenderPage(10);
        }
    }

    run() {
        if (this.app.user.isLogout) {
            return this.app.warning(this.app.e.LOGIN_FIRST);
        }
        this.observeRouteParam();
    }

    observeRouteParam() {
        this.active.params.subscribe(params => {
            if (params['id']) {
                this.openChatRoom(params['id']);
                this.closeRecentChatUsers();
            }
            else {
                this.openRecentChatUsers();
            }
        });
    }


    openChatRoom(xapiUid) {
        // console.log("ChatPage::openChatRoom() ======> ")
        let a = this.app;
        let uid = parseInt(xapiUid);
        if (uid == a.user.id) return a.warning(-8300, "You cannot chat with yourself");
        if (!uid) return a.warning(-80903, "Wrong user id");
        // console.log("Going to observe a chat room with otherXapiUid: ", uid);

        this.unObserveChatUser();
        this.queryUserByXapiUid(uid).once('value', snap => {
            let val = snap.val();
            if (!val) return a.warning(-8090, "User not exists on chat server");
            let keys = Object.keys(val);
            let uid = keys[0];
            let user = val[uid];
            // user['uid'] = uid;
            // this.chat.other = user;
            this.setChatUser(uid, user);
            // console.log('Chat room otherUser: ', this.chat.other);
            this.chat.setCurrentRoomAsRead(uid);

            this.observeChat();
            this.observeChatUser();

        }, e => console.error(e));
    }
    closeChatRoom() {
        this.unsetChatUser();
        this.unObserveChat();
        this.unObserveChatUser();
    }

    setChatUser(uid, val) {
        let user: CHAT_USER = val;
        // console.log("Observe chat user: ", user);
        if (user === null || user.status === void 0) return;
        this.chat.other = user;
        this.chat.other.uid = uid;
    }
    unsetChatUser() {
        this.chat.other = null;
        // console.log("unsetChatUser() ===> this.chat.other: ", this.chat.other);
    }

    /**
     * Do not observe chat messages of the room
     */
    unObserveChat() {
        if (this.onObserveChat && this.chat.myCurrentRoom) {
            this.chat.myCurrentRoom.off('child_added', this.onObserveChat);
            this.onObserveChat = null;
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

    observeChatUser() {
        let uid = this.chat.other.uid; /// @warning this is confusing.
        this.onObserveChatUser = this.referenceUser(uid).on('value', snap => {
            this.setChatUser(uid, snap.val());
            this.app.rerenderPage();
        });
    }
    unObserveChatUser() {
        if (this.onObserveChatUser) {
            this.referenceUser(this.chat.uid).off('value', this.onObserveChatUser);
            this.onObserveChatUser = null;
        }
    }

    observeChat() {
        // console.log("ChatPage::observeChat()==========>");
        let a = this.app;           /// app
        let p = this.chat.myCurrentRoom;       /// other room path
        if (p === null) return a.warning(a.e.CHAT_ROOM_PATH);

        this.unObserveChat();
        p.limitToLast(30).once('value', snap => {
            if (snap.val() === null) {
                /// error
                return
            }
            let val = snap.val();
            // console.log("observeChat() snap.val: ", val);
            let keys = Object.keys(val);
            this.chats = [];
            for (let key of keys) {
                this.chats.push(val[key]);
            }
            // console.log(this.chats);

            this.chats.pop(); //
            this.app.rerenderPage(10);
        });

        this.onObserveChat = p.limitToLast(1).on('child_added', snap => {
            let chat = snap.val();
            if (chat === null) return;
            this.chats.push(chat);
                
        });
    }

    onEnterMessage() {
        if (!this.message) return;
        let a = this.app;           /// app
        if (!this.chat.other) return a.warning(-80901, "No chat user");

        let myRoom = this.chat.myCurrentRoom;       /// my current chat room with other user
        if (myRoom === null) return a.warning(a.e.CHAT_ROOM_PATH);

        // console.log("message: ", this.message);
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
            this.chat.pushMessage(this.chat.otherXapiUid, data);
        });

        this.chat.otherCurrentRoom.push().set(data); // send to other.
        this.message = '';
    }

    openRecentChatUsers() {
        let a = this.app;
        if (a.user.isLogout) return a.warning(a.e.LOGIN_FIRST);
        if (this.chat.myRooms === null) return a.warning(a.e.CHAT_ROOM_PATH);
        this.rooms = [];
        this.showChatUsers = !this.showChatUsers;
        this.unObserveUsers();
        if (this.showChatUsers) this.openRecentUsers();
        else this.closeRecentChatUsers();
        this.unsetChatUser();
    }

    closeRecentChatUsers() {
        this.showChatUsers = false;
        this.unObserveChat();
    }

    unObserveMyRooms() {
        // debugger;
        if ( this.onObserveMyRooms && this.chat.myRooms ) {
            this.chat.myRooms.off('value', this.onObserveMyRooms);
            this.onObserveMyRooms = null;
        }
    }
    openRecentUsers() {
        this.closeChatRoom();
        let a = this.app;
        this.unObserveMyRooms();
        this.onObserveMyRooms = this.chat.myRooms.on('value', snap => {
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

    showUnreadChats() {

    }


    isMyChat(chat: CHAT_MESSAGE) {
        return chat.otherUid != this.share.firebaseUid;
    }
}
