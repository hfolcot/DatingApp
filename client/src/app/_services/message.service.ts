import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { setPaginatedResult, setPaginationHeaders } from './paginationHelper';
import { Observable } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/User';
import { Group } from '../_models/Group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject<HttpClient>(HttpClient);
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUsername: string): void {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'message?user=' + otherUsername, {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("ReceiveMessageThread", messages => {
      this.messageThread.set(messages);
    });
    
    this.hubConnection.on("NewMessage", message => {
      this.messageThread.update(messages => {
        return [...messages, message];
      })
    })

    this.hubConnection.on("UpdatedGroup", (group: Group) => {
      if(group.connections.some(x => x.username === otherUsername)) {
        this.messageThread.update(messages => {
          messages.forEach(message => {
            if(!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })

          return messages;
        })
      }
    })
  }

  stopHubConnection(): void {
    if(this.hubConnection?.state == HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string): void {
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);

    this.http.get<Message[]>(this.baseUrl + 'messages', {observe: 'response', params}).subscribe({
      next: response => setPaginatedResult(response, this.paginatedResult)
    })
  }

  getMessageThread(username: string) : Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string): Promise<any> {
    return this.hubConnection?.invoke("SendMessage", { recipientUsername: username, content});
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
