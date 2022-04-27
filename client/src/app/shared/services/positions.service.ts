import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PositionResponse, PositionsResponse} from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class PositionsService {

  constructor(private http: HttpClient) {

  }

  getById(id: string): Observable<PositionResponse>{
    return this.http.get<PositionResponse>(`/api/position/${id}`)
  }

  getByCategory(id: string): Observable<PositionsResponse>{
    if(!id){id = 'null'}
    return this.http.get<PositionsResponse>(`/api/position/category/${id}`)
  }

  getByBarcode(bc: string): Observable<PositionsResponse>{
    if(!bc){bc = 'null'}
    return this.http.get<PositionsResponse>(`/api/position/barcode/${bc}`)
  }

  getAll(): Observable<PositionsResponse>{
    return this.http.get<PositionsResponse>('/api/position')
  }

  create(formVal: any, image?: File): Observable<PositionResponse>{
    const fp = new FormData()
    if(image){
      fp.append('image', image, image.name)
    }
    fp.append('name', formVal.name)
    if(formVal.category){
      fp.append('category', formVal.category)
    }
    if(formVal.cost){
      fp.append('cost', formVal.cost)
    }
    if(formVal.barcode){
      fp.append('barcode', formVal.barcode)
    }

    return this.http.post<PositionResponse>('/api/position/', fp)
  }

  update(id: string, formVal: any, image?: File): Observable<PositionResponse>{
    const fd = new FormData()
    if(image){
      fd.append('image', image, image.name)
    }
    fd.append('name', formVal.name)
    if(formVal.category){
      fd.append('category', formVal.category)
    }
    if(formVal.cost){
      fd.append('cost', formVal.cost)
    }
    if(formVal.barcode){
      fd.append('barcode', formVal.barcode)
    }

    return this.http.patch<PositionResponse>(`/api/position/${id}`, fd)
  }

  remove(id: string): Observable<PositionResponse>{
    return this.http.delete<PositionResponse>(`/api/position/${id}`)
  }
}
