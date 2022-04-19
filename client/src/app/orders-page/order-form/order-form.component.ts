import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialService} from "../../shared/classes/material.service";
import {OrderService} from "../../shared/services/order.service";
import {ActivatedRoute, Params} from "@angular/router";
import {of, switchMap} from "rxjs";
import {SelectPositionComponent} from "../../shared/components/select-position/select-position.component";
import { format } from 'date-fns';
import {SelectClientComponent} from "../../shared/components/select-client/select-client.component";
import {Order} from "../../shared/interfaces";
import {constService} from "../../shared/services/const.service";

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  form: FormGroup
  isNew = true
  // @ts-ignore
  @ViewChild('order_tabs') order_tabs: ElementRef
  // @ts-ignore
  @ViewChild('selectField') selectField: ElementRef;
  displayedColumns: string[] = ['name', 'quantity', 'cost', 'total'];
  displayedColumnsP: string[] = ['type', 'total'];
  // @ts-ignore
  //dataSource: MatTableDataSource<OrderList>
  // @ts-ignore
  @ViewChild(SelectPositionComponent) pos_sel
  // @ts-ignore
  @ViewChild(SelectClientComponent) client_sel
  // @ts-ignore
  loading: boolean
  // @ts-ignore
  order: Order
  paymentTypes: any[] | undefined

  constructor(
    private orderServ: OrderService,
    private route: ActivatedRoute,
    private constServ: constService) { }

  ngAfterViewInit() {
    MaterialService.InitTabs(this.order_tabs)
    //MaterialService.InitSelect(this.selectField)
  }

  ngOnInit(): void {
    this.loading = true
    this.paymentTypes = this.constServ.getPaymentTypes()
    this.form = new FormGroup({
      date: new FormControl(null, Validators.required),
      number: new FormControl(null),
      client: new FormControl(null, Validators.required),
      clientName: new FormControl(null),
      list: new FormArray([]),
      payment: new FormArray([]),
    })

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.orderServ.getById(params['id'])
            } else {
              this.form.patchValue({
                date: format(new Date(), "yyyy-MM-dd")
              })
              return of(null)
            }
          }
        )
      ).subscribe(
        resp => {
          if(resp?.success){
            this.order = resp.order
            this.form.patchValue({
              date: format(new Date(resp.order.date), "yyyy-MM-dd"),//'2018-07-22'
              number: resp.order.number,
              client: resp.order.client,
              clientName: resp.order.client_details[0].name,
            })

            resp.order.list.forEach(listEl => {
              this.addListRow(listEl.name, listEl.quantity, listEl.cost, listEl.total)
            })
            resp.order.payment.forEach(listEl => {
              this.addPaymentRow(listEl.type, listEl.total)
            })
          }
          MaterialService.UpdateTxtFields()
          this.loading = false
        }
    )
  }

  get listFormArray(){
    return this.form.get('list') as FormArray
  }

  get paymentFormArray(){
    return this.form.get('payment') as FormArray
  }

  addListRow(name: string, quantity: number = 1, cost: number = 0, total: number = 0){
    let new_list_fg = new FormGroup({
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      cost: new FormControl(cost),
      total: new FormControl(total),
    })
    this.listFormArray.push(new_list_fg)
  }

  addPaymentRow(type: string = '', total: number = 0){
    let new_pay_fg = new FormGroup({
      type: new FormControl(type, Validators.required),
      total: new FormControl(total, Validators.required),
    })
    this.paymentFormArray.push(new_pay_fg)
  }

  editListRow(index: number, name: string = '', quantity: number = 0, cost: number = 0){
    let new_list_fg = this.listFormArray.at(index)

    if(name){
      new_list_fg.patchValue({name: name})
    }
    if(quantity){
      new_list_fg.patchValue({quantity: quantity})
    }
    if(cost){
      new_list_fg.patchValue({cost: cost})
    }
    this.updateTotals(index)
  }

  editPaymentRow(index: number, type: string = '', total: number = 0){
    let new_pay_fg = this.paymentFormArray.at(index)

    if(type){
      new_pay_fg.patchValue({type: type})
    }
    if(total){
      new_pay_fg.patchValue({total: total})
    }
  }

  updateTotals(index: number){
    let new_list_fg = this.listFormArray.at(index)
    // @ts-ignore
    let total: number = new_list_fg.get('quantity').value * new_list_fg.get('cost').value
    new_list_fg.patchValue({total: total})
  }

  removeListControl(index: number){
    this.listFormArray.removeAt(index);
  }

  removePaymentControl(index: number){
    this.paymentFormArray.removeAt(index);
  }

  positionAfterSelect(params: any){//pos: Position, index: number
    this.editListRow(params.index, params.position.name,0,params.position.cost)
  }

  clientAfterSelect(params: any){
    this.form.patchValue({
      client: params.client._id,
      clientName: params.client.name
    })
    MaterialService.UpdateTxtFields()
  }

  onSubmit(){
    let obs$
    this.form.disable()
    if(this.isNew){
      //create
      obs$ = this.orderServ.create(this.form.value)
    }else if (this.order._id != null){
      //update
      obs$ = this.orderServ.update(this.order._id, this.form.value)
    }

    // @ts-ignore
    obs$.subscribe(
      posResp => {
        this.form.enable()
        if(posResp && posResp.success){
          MaterialService.toast('Дані збережено')
          this.order = posResp.order
          if(this.isNew){
            this.isNew = false
            this.form.patchValue({
              number: posResp.order.number
            })
          }
          MaterialService.UpdateTxtFields()
        }else{
          MaterialService.toast(posResp.message)
        }
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    )
  }
}
