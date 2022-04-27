import {AfterViewInit, Component, ElementRef, OnInit, Inject, ViewChild} from '@angular/core';
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
import { DOCUMENT } from '@angular/common';
import {PositionsService} from "../../shared/services/positions.service";

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
  // @ts-ignore
  @ViewChild('orderTotal') orderTotal: ElementRef;
  // @ts-ignore
  @ViewChild('paidTotal') paidTotal: ElementRef;
  // @ts-ignore
  @ViewChild('barcodeInput') barcodeInput: ElementRef;
  show_barcode: boolean
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
  orderStatuses: any[] | undefined

  constructor(
    private orderServ: OrderService,
    private posServ: PositionsService,
    private route: ActivatedRoute,
    private constServ: constService,
    @Inject(DOCUMENT) private _document: HTMLDocument) {
    this.show_barcode = false
  }

  ngAfterViewInit() {
    MaterialService.InitTabs(this.order_tabs)
    MaterialService.UpdateTxtFields()
    MaterialService.InitSelect(this.selectField)
    let tooltipped = this._document.querySelectorAll('.tooltipped');
    MaterialService.InitTooltip(tooltipped)
    //MaterialService.UpdateTextarea(this.textarea)
  }

  ngOnInit(): void {
    this.loading = true
    this.paymentTypes = this.constServ.getPaymentTypes()
    this.orderStatuses = this.constServ.getOrderStatuses()
    this.form = new FormGroup({
      date: new FormControl(null, Validators.required),
      number: new FormControl(null),
      status: new FormControl(null),
      detail: new FormControl(null),
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
              status: resp.order.status,
              detail: resp.order.detail,
              client: resp.order.client,
              clientName: resp.order.client_details[0].name,
            })

            resp.order.list.forEach(listEl => {
              this.addListRow(listEl.id, listEl.name, listEl.quantity, listEl.cost, listEl.total)
            })
            resp.order.payment.forEach(listEl => {
              this.addPaymentRow(listEl.type, listEl.total)
            })
            MaterialService.InitSelect(this.selectField)
            this.updateOrderTotals()
            this.updatePaidTotals()
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

  addListRow(id: string, name: string, quantity: number = 1, cost: number = 0, total: number = 0){
    let new_list_fg = new FormGroup({
      id: new FormControl(id, Validators.required),
      name: new FormControl(name, Validators.required),
      quantity: new FormControl(quantity),
      cost: new FormControl(cost),
      total: new FormControl(total),
    })
    this.listFormArray.push(new_list_fg)
  }

  addPaymentRow(type: number = 0, total: number = 0){
    let new_pay_fg = new FormGroup({
      type: new FormControl(type, Validators.required),
      total: new FormControl(total, Validators.required),
    })
    this.paymentFormArray.push(new_pay_fg)
  }

  editListRow(index: number, id: string = '', name: string = '', quantity: number = 0, cost: number = 0){
    let new_list_fg = this.listFormArray.at(index)

    if(id){
      new_list_fg.patchValue({id: id})
    }
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
    this.updateOrderTotals()
  }

  updateOrderTotals(){
    let total = 0;
    let index = this.listFormArray.length
    while(index > 0){
      index--
      let list_fg = this.listFormArray.at(index)
      // @ts-ignore
      total += list_fg.get('total').value
    }
    this.orderTotal.nativeElement.value = (total ? total : '');
  }

  updatePaidTotals(){
    let total = 0;
    let index = this.paymentFormArray.length
    while(index > 0){
      index--
      let list_fg = this.paymentFormArray.at(index)
      // @ts-ignore
      total += list_fg.get('total').value
    }
    this.paidTotal.nativeElement.value = (total ? total : '');
  }

  removeListControl(index: number){
    this.listFormArray.removeAt(index);
  }

  removePaymentControl(index: number){
    this.paymentFormArray.removeAt(index);
  }

  //******************** After Select ***************

  positionAfterSelect(params: any){//pos: Position, index: number
    this.editListRow(params.index, params.position._id, params.position.name,0,params.position.cost)
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

  //******************** BARCODE ***************

  showhide_barcode(){
    this.show_barcode = !this.show_barcode
    if(this.show_barcode){
      setTimeout(()=> {
        this.barcodeInput.nativeElement.focus()
      },0)
    }
  }

  barcodeFind(event: any){
    this.barcodeInput.nativeElement.className = this.barcodeInput.nativeElement.className.replaceAll(' invalid','')
    if(this.barcodeInput.nativeElement.value){
      let pos = this.posServ.getByBarcode(this.barcodeInput.nativeElement.value)
        .subscribe(
          resp => {
            if(resp.success && resp.positions.length){
              let this_pos = resp.positions[0]
              if(this_pos._id) {
                let curent_row = this.listFormArray.controls.findIndex((x: any) => {
                  return x.value.id == this_pos._id
                })
                if (curent_row > 0) {
                  let list_fg = this.listFormArray.at(curent_row)
                  if(list_fg){
                    this.editListRow(curent_row, this_pos._id, this_pos.name, list_fg.get('quantity')?.value + 1)
                  }
                } else {
                  this.addListRow(this_pos._id, this_pos.name, 1, this_pos.cost)
                }
              }
            } else {
              this.barcodeInput.nativeElement.className += ' invalid'
            }
            this.barcodeInput.nativeElement.select()
          })
    }
  }
}
