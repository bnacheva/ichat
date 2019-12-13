import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { UserService } from '../../shared/service/user.service';
import { User } from '../../shared/model/user';
import { RxStompService } from '@stomp/ng2-stompjs';
import { ChannelService } from '../../shared/service/channel.service';
import { Message } from '../../shared/model/message';
import { MatSnackBar } from '@angular/material';
import { MessageService } from '../../shared/service/message.service';
import { RxStompState } from '@stomp/rx-stomp';

@Component({
    selector: 'wt-userlist',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

    NEW_USER_LIFETIME: number = 1000 * 5;

    @Input()
    username: string;

    @Output()
    receiverUpdated = new EventEmitter<string>();

    users: Array<User> = [];
    highlightedUsers: Array<string> = [];
    newConnectedUsers: Array<string> = [];
    channel: string;
    receiver: string;
    topicSubscription;

    constructor(private userService: UserService, private stompService: RxStompService,
        private channelService: ChannelService, private snackBar: MatSnackBar,
        private messageService: MessageService) { }

    ngOnInit() {
        this.userService.findUsers().subscribe(
            (res: User[]) => {
                this.users = res;
                this.initUserEvents();
            }
        );

        this.channelService.getChannel().subscribe(channel => this.channel = channel);
    }

    @HostListener('window:focus', [])
    sendReadReceipt() {
        if (this.channel != null && this.receiver != null) {
            this.messageService.sendReadReceipt(this.channel, this.receiver);
        }
    }

    startChatWithUser(user) {
        const channelId = ChannelService.createChannel(this.username, user.username);
        this.channelService.refreshChannel(channelId);
        this.receiver = user.username;
        this.highlightedUsers = this.highlightedUsers.filter(u => u !== user.username);
        this.receiverUpdated.emit(user.username);
        this.messageService.sendReadReceipt(channelId, user.username);
    }

    getOtherUsers(): Array<User> {
        return this.users.filter(user => user.username !== this.username);
    }

    getUserItemClass(user): string {
        let classes: string = 'user-item';
        if (user.username === this.receiver) {
            classes += ' current-chat-user ';
        }

        if (this.highlightedUsers.indexOf(user.username) >= 0) {
            classes += ' new-message';
        }

        if (this.newConnectedUsers.indexOf(user.username) >= 0) {
            classes += ' new-user';
        }

        if (!user.connected) {
            classes += ' disconnected-user';
        }

        return classes;
    }

    initUserEvents() {
        this.stompService.watch('/channel/login').subscribe(res => {
            const data: User = JSON.parse(res.body);
            if (data.username !== this.username) {
                this.newConnectedUsers.push(data.username);
                setTimeout((
                    function () {
                        this.removeNewUserBackground(data.username);
                    }
                ).bind(this), this.NEW_USER_LIFETIME);
                this.users = this.users.filter(item => item.username !== data.username);
                this.users.push(data);
                this.subscribeToOtherUser(data);
            }
        });

        this.stompService.watch('/channel/logout').subscribe(res => {
            const data: User = JSON.parse(res.body);
            this.users = this.users.filter(item => item.username !== data.username);
            this.users.push(data);
            const channelId = ChannelService.createChannel(this.username, data.username);
            if (this.channel === channelId) {
                this.receiverUpdated.emit('');
                this.channelService.removeChannel();
            }
        });

        this.subscribeToOtherUsers(this.users, this.username);
    }

    removeNewUserBackground(username) {
        this.newConnectedUsers = this.newConnectedUsers.filter(u => u !== username);
    }

    subscribeToOtherUsers(users, username) {
        const filteredUsers: Array<any> = users.filter(user => username !== user.username);
        filteredUsers.forEach(user => this.subscribeToOtherUser(user));
    }

    subscribeToOtherUser(otherUser): string {
        const channelId = ChannelService.createChannel(this.username, otherUser.username);
        this.stompService.watch(`/channel/chat/${channelId}`).subscribe(res => {
            const data: Message = JSON.parse(res.body);
            this.messageService.pushMessage(data);

            if (data.channel !== this.channel) {
                this.showNotification(data);
            } else {
                // send read receipt for the channel
                this.messageService.sendReadReceipt(this.channel, otherUser.username);
            }
        });

        return channelId;
    }

    showNotification(message: Message) {
        const snackBarRef = this.snackBar.open('New message from ' + message.sender, 'Show', { duration: 3000 });
        this.highlightedUsers.push(message.sender);
        snackBarRef.onAction().subscribe(() => {
            this.receiver = message.sender;
            this.receiverUpdated.emit(message.sender);
            this.channel = ChannelService.createChannel(this.username, message.sender);
            this.channelService.refreshChannel(this.channel);
        });
    }
}
