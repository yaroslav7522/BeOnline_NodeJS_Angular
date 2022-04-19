import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Client, Position} from "../../interfaces";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ClientsService} from "../../services/clients.service";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-select-client',
  templateUrl: './select-client.component.html',
  styleUrls: ['./select-client.component.css']
})
export class SelectClientComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'phone', 'email'];
  // @ts-ignore
  @ViewChild('modal_clients') public modal_clients: ElementRef
  // @ts-ignore
  dataSource: MatTableDataSource<Position>
  loaded: boolean
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter_txt') filter_txt!: ElementRef;
  @Output("parentComp") parentComp = new EventEmitter<any>();

  constructor(private clientServ: ClientsService) {
    this.loaded = false
  }

  ngAfterViewInit() {
    MaterialService.InitPopup(this.modal_clients)
  }

  openModal(){
    if(!this.dataSource){
      this.loadData()
    }
    let instance = MaterialService.getPopupInstance(this.modal_clients);
    instance.open()
  }

  close() {
    let instance = MaterialService.getPopupInstance(this.modal_clients);
    instance.close()
  }

  loadData(){
    this.clientServ.getAll().subscribe(
      resp => {
        if(resp.success){
          this.dataSource = new MatTableDataSource<Position>(resp.clients)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loaded = true
        }else {
          MaterialService.toast(resp.message)
        }
      },
      error => MaterialService.toast(error.error.message)
    )
  }

  applyFilter() {
    let filterValue = this.filter_txt.nativeElement.value
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  selectRow(element: Client){
    this.parentComp.emit({ client: element })
    this.close()
  }

}
