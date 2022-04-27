import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderResponse, OrdersResponse, PositionResponse} from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  constructor(private http: HttpClient) { }

  getAll(filter?: string): Observable<OrdersResponse>{
    return this.http.get<OrdersResponse>('/api/order/' + (filter ? `?${filter}` : ''))
  }

  getById(id: string): Observable<OrderResponse>{
    return this.http.get<OrderResponse>(`/api/order/${id}`)
  }

  create(formVal: any): Observable<OrderResponse>{
    const fp = new FormData()
    fp.append('client', formVal.client)
    fp.append('date', formVal.date)
    fp.append('status', (formVal.status ? formVal.status : 0))
    fp.append('detail', (formVal.detail ? formVal.detail : ''))

    if(formVal.list){
      this.createFormData(fp, 'list', formVal.list)
    }
    if(formVal.payment){
      this.createFormData(fp, 'payment', formVal.payment)
    }

    return this.http.post<OrderResponse>('/api/order/', fp)
  }

  update(id: string, formVal: any): Observable<OrderResponse>{
    const fp = new FormData()
    fp.append('client', formVal.client)
    fp.append('date', formVal.date)
    fp.append('status', (formVal.status ? formVal.status : 0))
    fp.append('detail', (formVal.detail ? formVal.detail : ''))

    if(formVal.list){
      this.createFormData(fp, 'list', formVal.list)
    }
    if(formVal.payment){
      this.createFormData(fp, 'payment', formVal.payment)
    }

    return this.http.patch<OrderResponse>(`/api/order/${id}`, fp)
  }

  remove(id: string): Observable<PositionResponse>{
    return this.http.delete<PositionResponse>(`/api/position/${id}`)
  }

  createFormData(formData: FormData, key: string, data: any) {
    if (data === Object(data) || Array.isArray(data)) {
      for (var i in data) {
        this.createFormData(formData, key + '[' + i + ']', data[i]);
      }
    } else {
      formData.append(key, data);
    }
  }
}
