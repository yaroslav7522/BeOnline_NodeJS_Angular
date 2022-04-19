import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { GithubApi } from "../interfaces";
import { SortDirection } from "@angular/material/sort";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private httpClient: HttpClient) {
  }

  getSampleData(sort: string, order: SortDirection, page: number): Observable<GithubApi> {
    return this.httpClient.get<GithubApi>(`https://api.github.com/search/issues?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`);
  }
}
