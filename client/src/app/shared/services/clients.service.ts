import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ClientResponse, ClientsResponse} from "../interfaces";
// import {SortDirection} from "@angular/material/sort";


@Injectable({
  providedIn: 'root'
})

export class ClientsService {

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<ClientsResponse>{//sort: string, order: SortDirection, page: number
    return this.http.get<ClientsResponse>('/api/client') //?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}
  }

  getById(id: string): Observable<ClientResponse>{
    return this.http.get<ClientResponse>(`/api/client/${id}`)
  }

  create(formVal: any): Observable<ClientResponse>{
    const fp = new FormData()
    fp.append('name', formVal.name)
    if(formVal.phone){
      fp.append('phone', formVal.phone)
    }
    if(formVal.email){
      fp.append('email', formVal.email)
    }
    if(formVal.barcode){
      fp.append('barcode', formVal.barcode)
    }
    if(formVal.bdate){
      fp.append('bdate', formVal.bdate)
    }

    return this.http.post<ClientResponse>('/api/client/', fp)
  }

  update(id: string, formVal: any): Observable<ClientResponse>{
    const fp = new FormData()
    fp.append('name', formVal.name)
    if(formVal.phone){
      fp.append('phone', formVal.phone)
    }
    if(formVal.email){
      fp.append('email', formVal.email)
    }
    if(formVal.barcode){
      fp.append('barcode', formVal.barcode)
    }
    if(formVal.bdate){
      fp.append('bdate', formVal.bdate)
    }

    return this.http.patch<ClientResponse>(`/api/client/${id}`, fp)
  }

  remove(id: string): Observable<ClientResponse>{
    return this.http.delete<ClientResponse>(`/api/client/${id}`)
  }
}
