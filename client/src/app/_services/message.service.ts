import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { setPaginatedResult, setPaginationHeaders } from './paginationHelper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject<HttpClient>(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null)

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

  sendMessage(username: string, content: string): Observable<Message> {
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content});
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
