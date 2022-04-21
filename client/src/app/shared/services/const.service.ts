import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class constService {

  constructor(){}

  getPaymentStatuses(): any[]{
    return [
      {id: 1, class:'', name: 'Оплачено'},
      {id: 2, class:'orange', name: 'Частково оплачено'},
      {id: 3, class:'red', name: 'Не оплачено'},
    ]
  }

  getPaymentTypes(): any[]{
    return [
      {id: 1, name: 'Готівка'},
      {id: 2, name: 'Банківська карта'},
    ]
  }

  getOrderStatuses(): any[]{
    return [
      {id: 1, name: 'Новий'},
      {id: 2, name: 'Обробляється'},
      {id: 3, name: 'Доставляється'},
      {id: 4, name: 'Відмінено'},
      {id: 5, name: 'Завершено'},
    ]
  }
}
