import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CategoriesResponse, CategoryResponse} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {

  constructor(private http: HttpClient) {

  }

  // @ts-ignore
  fetch(parentId: string  = ''): Observable<CategoriesResponse>{
    const params = new HttpParams().append('parentId', parentId);
    return this.http.get<CategoriesResponse>('/api/category', {params})
  }

  getById(id: string): Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(`/api/category/${id}`)
  }

  create(name: string, image?: File, parent?: string): Observable<CategoryResponse>{
    const fd = new FormData()
    if(image){
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    if(parent){
      fd.append('parent', parent)
    }

    return this.http.post<CategoryResponse>('/api/category', fd)
  }

  update(id: string, name: string, image?: File, parent?: string): Observable<CategoryResponse>{
    const fd = new FormData()
    if(image){
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    if(parent){
      fd.append('parent', parent)
    }

    return this.http.patch<CategoryResponse>(`/api/category/${id}`, fd)
  }

  remove(id: string): Observable<CategoryResponse>{
    return this.http.delete<CategoryResponse>(`/api/category/${id}`)
  }

  getTree(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>('/api/category/tree')
  }

  getBreadcrumbs(id: string, key: number = 0): Promise<any[]>{
    let bc: any = []

    return new Promise((resolve, reject) => {
      this.getById(id).subscribe(
        catResp => {
          if(catResp.success){
            bc.push({level: key, name: catResp.category.name, id: catResp.category._id})
            if(catResp.category.parent){
              this.getBreadcrumbs(catResp.category.parent, key + 1)
                .then((result) => {
                  result.forEach(element => {
                    bc.push(element)
                  })
                  bc.sort((a: any,b: any) => (a.level < b.level) ? 1 : ((b.level < a.level) ? -1 : 0))
                  resolve(bc)
                })
            }else{
              //final result
              bc.sort((a: any,b: any) => (a.level < b.level) ? 1 : ((b.level < a.level) ? -1 : 0))
              resolve(bc)
            }
          }else{ resolve(bc) }
        }
      )
    })
  }
}
