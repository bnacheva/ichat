import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/service/user.service';
import {
    AuthService, FacebookLoginProvider,
    GoogleLoginProvider, SocialUser
} from 'angularx-social-login';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    message: string;
    private user: SocialUser;

    constructor(private router: Router,
        private userService: UserService,
        private authService: AuthService) { }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            if (user != null) {
                this.connect(user.name);
            }
        });
    }

    connect(username: string) {
        this.clearData();
        if (username === null || username === undefined || username === '') {
            this.message = 'You must enter a username';
            return;
        }

        this.userService.login({ 'id': null, 'username': username })
            .subscribe(
                res => {
                    sessionStorage.setItem('user', username);
                    this.router.navigate(['home']);
                },
                error => {
                    this.message = error.error;
                });
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    clearData() {
        sessionStorage.removeItem('user');
        this.message = null;
    }

}
