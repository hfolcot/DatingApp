import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/User';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject<ToastrService>(ToastrService);
  private _onlineUsers = signal<string[]>([]);
  private router = inject<Router>(Router);
  onlineUsers = this._onlineUsers.asReadonly();

  createHubConnection(user: User): void {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presence', {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("UserIsOnline", username => {
      this._onlineUsers.update(users => [...users, username]);
    })
    
    this.hubConnection.on("UserIsOffline", username => {
      this._onlineUsers.update(users => [...users.filter(u => u != username)]);
    })

    this.hubConnection.on("GetOnlineUsers", users => {
      this._onlineUsers.set(users);
    })

    this.hubConnection.on("NewMessageReceived", ({username, knownAs }) => {
      this.toastr.info(knownAs + ' has sent you a new message! Click here to see it.')
        .onTap.pipe(take(1)).subscribe({
          next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
        })
    })
  }

  stopHubConnection(): void {
    if(this.hubConnection?.state == HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }
}
