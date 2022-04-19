import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Order} from "../shared/interfaces";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Title} from "@angular/platform-browser";
import {OrderService} from "../shared/services/order.service";
import {MaterialService} from "../shared/classes/material.service";
import {constService} from "../shared/services/const.service";

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['date', 'number', 'client_details', 'status', 'total', 'actions'];
  // @ts-ignore
  dataSource: MatTableDataSource<Order>
  // @ts-ignore
  loading: boolean
  paymentStatuses: any[] | undefined
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ts-ignore
  @ViewChild('modal_filter') public modal_filter: ElementRef

  constructor(private titleService: Title, private orderServ: OrderService, private constServ: constService) { }

  ngOnInit(): void {
    this.titleService.setTitle('OnlineCafe - Замовлення')
    this.loadOrders()
    this.paymentStatuses = this.constServ.getPaymentStatuses()
  }

  ngAfterViewInit() {
    MaterialService.InitPopup(this.modal_filter)
  }

  loadOrders(){
    this.loading = true
    this.orderServ.getAll().subscribe(
      resp => {
        if(resp.success){
          this.dataSource = new MatTableDataSource<Order>(resp.orders)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }else {
          MaterialService.toast(resp.message)
        }
      },
      error => MaterialService.toast(error.error.message),
      () => {this.loading = false}
    )
  }

  getPaymentStatus(element: any){
    let total = 0
    let payment = 0
    element.list.forEach((el: { total: number; }) => {
      total = total + (el.total? el.total : 0)
    })
    element.payment.forEach((el: { total: number; }) => {
      payment = payment + (el.total? el.total : 0)
    })
    if(payment >= total){
      return 1 //full pay
    }else if (payment > 0 && total > 0){
      return 2 //Prepayment
    }else if(total > 0){
      return 3 //Debt
    }
    return 0
  }

  getTotal(element: any){
    let total = 0
    element.list.forEach((el: { total: number; }) => {
      total = total + (el.total? el.total : 0)
    })
    return total
  }

  removeOrder(id: string, number: string){

  }

  openFilter(){
    let instance = MaterialService.getPopupInstance(this.modal_filter);
    instance.open()
  }

  closeFilter() {
    let instance = MaterialService.getPopupInstance(this.modal_filter);
    instance.close()
  }

}
