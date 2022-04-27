import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Order} from "../shared/interfaces";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Title} from "@angular/platform-browser";
import {OrderService} from "../shared/services/order.service";
import {MaterialService} from "../shared/classes/material.service";
import {constService} from "../shared/services/const.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SelectClientComponent} from "../shared/components/select-client/select-client.component";
import {ClientsService} from "../shared/services/clients.service";
import {format, addDays, eachWeekOfInterval, endOfMonth, startOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear} from "date-fns";

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['pays', 'date', 'number', 'client_details', 'status', 'total', 'actions'];
  // @ts-ignore
  dataSource: MatTableDataSource<Order>
  // @ts-ignore
  loading: boolean
  paymentStatuses: any[] | undefined
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // @ts-ignore
  @ViewChild('modal_filter') public modal_filter: ElementRef
  // @ts-ignore
  @ViewChild('periodSelect') public periodSelect: ElementRef
  // @ts-ignore
  @ViewChild('statusSelect') public statusSelect: ElementRef
  // @ts-ignore
  @ViewChild(SelectClientComponent) client_sel
  // @ts-ignore
  filterForm: FormGroup
  // @ts-ignore
  filterColections: any[]
  orderStatuses: any[] | undefined

  constructor(
    private titleService: Title,
    private orderServ: OrderService,
    private clientServ: ClientsService,
    private constServ: constService) { }

  ngOnInit(): void {
    this.titleService.setTitle('OnlineCafe - Замовлення')

    this.paymentStatuses = this.constServ.getPaymentStatuses()
    this.orderStatuses = this.constServ.getOrderStatuses()

    this.filterColections = []
    this.filterForm = new FormGroup({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      client: new FormControl(null),
      clientName: new FormControl(null),
      status: new FormControl(null),
    })

    let queryFilterSaved = window.localStorage.getItem('order_filter')
    if (queryFilterSaved) {
      this.parseQueryFilter(queryFilterSaved)
    } else {
      this.loadOrders()
    }
  }

  ngAfterViewInit() {
    MaterialService.InitPopup(this.modal_filter)
    MaterialService.InitSelect(this.statusSelect)
    MaterialService.UpdateTxtFields()
    //MaterialService.InitSelect(this.periodSelect)
  }

  loadOrders() {
    this.loading = true
    this.orderServ.getAll(this.getFilterQuery()).subscribe(
      resp => {
        if (resp.success) {
          this.dataSource = new MatTableDataSource<Order>(resp.orders)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          MaterialService.toast(resp.message)
        }
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.loading = false
      }
    )
  }

  getPaymentStatus(element: any) {
    let total = 0
    let payment = 0
    element.list.forEach((el: { total: number; }) => {
      total = total + (el.total ? el.total : 0)
    })
    element.payment.forEach((el: { total: number; }) => {
      payment = payment + (el.total ? el.total : 0)
    })
    if (payment >= total) {
      return 1 //full pay
    } else if (payment > 0 && total > 0) {
      return 2 //Prepayment
    } else if (total > 0) {
      return 3 //Debt
    }
    return 0
  }

  getTotal(element: any) {
    let total = 0
    element.list.forEach((el: { total: number; }) => {
      total = total + (el.total ? el.total : 0)
    })
    return total
  }

  clientAfterSelect(params: any) {
    this.filterForm.patchValue({
      client: params.client._id,
      clientName: params.client.name
    })
    MaterialService.UpdateTxtFields()
  }

  openFilter() {
    let instance = MaterialService.getPopupInstance(this.modal_filter);
    MaterialService.UpdateTxtFields()
    instance.open()
  }

  closeFilter() {
    let instance = MaterialService.getPopupInstance(this.modal_filter);
    instance.close()
  }

  applyFilter(auto: boolean = false) {
    this.filterColections = []
    if (this.filterForm.value.dateFrom || this.filterForm.value.dateTo) {
      this.filterColections?.push({
        name: 'date',
        title: 'Дата',
        value: (this.filterForm.value.dateFrom ? format(new Date(this.filterForm.value.dateFrom), "dd.MM.yyyy") : ' > ')
             + (this.filterForm.value.dateTo ? ' - ' + format(new Date(this.filterForm.value.dateTo), "dd.MM.yyyy") : ' < '),
        dateFrom: this.filterForm.value.dateFrom,
        dateTo: this.filterForm.value.dateTo
      })
    }
    if (this.filterForm.value.client) {
      this.filterColections?.push({
        name: 'client',
        title: 'Клієнт',
        value: this.filterForm.value.clientName,
        client: this.filterForm.value.client
      })
    }
    if (this.filterForm.value.status) {
      this.filterColections?.push({
        name: 'status',
        title: 'Статус',
        value: this.getStatusName(this.filterForm.value.status),
        status: this.filterForm.value.status
      })
    }

    if (!auto) {
      this.closeFilter()
    }
    this.loadOrders()
  }

  resetFilter() {
    //this.filterColections = []
    let filter_count = this.filterColections.length
    while (filter_count >= 0) {
      filter_count--
      let curItem = this.filterColections[filter_count]
      if (curItem) {
        this.removeFilter(filter_count, curItem.name)
      }
    }
    this.closeFilter()
    this.loadOrders()
  }

  getFilterQuery() {
    let query = ''

    if (this.filterColections && this.filterColections.length) {
      this.filterColections.forEach((item, index) => {
        if (item.name == 'date' && item.dateFrom) {
          query += (query.length ? '&' : '') + 'start=' + item.dateFrom
        }
        if (item.name == 'date' && item.dateTo) {
          query += (query.length ? '&' : '') + 'end=' + item.dateTo
        }
        if (item.name == 'client') {
          query += (query.length ? '&' : '') + 'client=' + item.client
        }
        if (item.name == 'status') {
          query += (query.length ? '&' : '') + 'status=' + item.status
        }
      })
    }

    window.localStorage.setItem('order_filter', query)
    return query
  }

  parseQueryFilter(query: string) {
    let filterArr = query.split('&')
    filterArr.forEach((item) => {
      let itemArr = item.split('=')
      if (itemArr.length > 1) {
        let filterName = itemArr[0]
        let filterVal = itemArr[1]

        if (filterName == 'client') {
          let clientInfo = this.clientServ.getById(filterVal)
            .subscribe(resp => {
              if (resp.success) {
                this.filterForm.patchValue({
                  client: resp.client._id,
                  clientName: resp.client.name
                })
              }
              this.applyFilter(true)
            })
        }
        if (filterName == 'start') {
          this.filterForm.patchValue({
            dateFrom: format(new Date(filterVal), "yyyy-MM-dd")
          })
          this.applyFilter(true)
        }
        if (filterName == 'end') {
          this.filterForm.patchValue({
            dateTo: format(new Date(filterVal), "yyyy-MM-dd")
          })
          this.applyFilter(true)
        }
        if (filterName == 'status') {
          this.filterForm.patchValue({
            status: filterVal
          })
          this.applyFilter(true)
        }
      }
    })
  }

  removeFilter(index: number, name: string) {
    if (index >= 0) {
      this.filterColections.splice(index, 1);
      if (name == 'date') {
        this.filterForm.patchValue({
          dateFrom: null,
          dateTo: null,
        })
      } else if (name == 'client') {
        this.filterForm.patchValue({
          client: null,
          clientName: null,
        })
      } else {
        this.filterForm.patchValue({
          [name]: null
        })
      }
      this.loadOrders()
    }
  }

  changePeriod() {
    let period = this.periodSelect.nativeElement.value
    let dateFrom: Date | undefined
    let dateTo: Date | undefined
    let today = new Date()

    if (period == 'today') {
      dateFrom = today
      dateTo = today
    }else if(period == 'yesterday'){
      dateFrom = addDays(today, -1)
      dateTo = addDays(today, -1)
    }else if(period == 'this_week'){
      let weeks = eachWeekOfInterval({start:today, end: today}, {weekStartsOn: 1})
      dateFrom = weeks[0]
      dateTo = addDays(dateFrom, 6)
    }else if(period == 'last_week'){
      let weeks = eachWeekOfInterval({start:addDays(today, -7), end: addDays(today, -7)}, {weekStartsOn: 1})
      dateFrom = weeks[0]
      dateTo = addDays(dateFrom, 6)
    }else if(period == 'this_month'){
      dateFrom = startOfMonth(today)
      dateTo = endOfMonth(today)
    }else if(period == 'last_month'){
      dateTo = endOfMonth(addDays(startOfMonth(today),-1))
      dateFrom = startOfMonth(dateTo)
    }else if(period == 'this_quarter'){
      dateFrom = startOfQuarter(today)
      dateTo = endOfQuarter(today)
    }else if(period == 'last_quarter'){
      dateTo = endOfQuarter(addDays(startOfQuarter(today),-1))
      dateFrom = startOfQuarter(dateTo)
    }else if(period == 'this_year'){
      dateFrom = startOfYear(today)
      dateTo = endOfYear(today)
    }else if(period == 'last_year'){
      dateTo = endOfYear(addDays(startOfYear(today),-1))
      dateFrom = startOfYear(dateTo)
    }

    if (dateFrom && dateTo) {
      this.filterForm.patchValue({
        dateFrom: format(new Date(dateFrom), "yyyy-MM-dd"),
        dateTo: format(new Date(dateTo), "yyyy-MM-dd")
      })
    }
  }

  getStatusName(id: number){
    if(this.orderStatuses){
      let status = this.orderStatuses.find(el => el.id === +id);
      return (status ? status.name : '')
    }
  }
}
