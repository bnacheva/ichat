import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { settings } from '../util/settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders({
    'Content-Type': 'application/json'
});

@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    login(user: User): any {
        return this.http.post(settings.baseUrl + '/login', user, { headers: headers });
    }

    logout(user: User): any {
        return this.http.post(settings.baseUrl + '/logout', user, { headers: headers });
    }

    findUsers() {
        return this.http.get(settings.baseUrl + '/listUsers', { headers: headers });
    }
}
