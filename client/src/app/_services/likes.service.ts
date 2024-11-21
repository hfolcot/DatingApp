import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/Pagination';
import { setPaginatedResult, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
private http = inject<HttpClient>(HttpClient);
likeIds = signal<number[]>([]);
paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number): void {
    let params = setPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    this.http.get<Member[]>(`${this.baseUrl}likes`, {observe: 'response', params}).subscribe({
      next: response => setPaginatedResult(response, this.paginatedResult)
    });
  }

  getLikeIds(): void {
    this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
