import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from "@angular/material/table";
import {ClientsService} from "../shared/services/clients.service";
import {Client} from "../shared/interfaces";
import {MaterialService} from "../shared/classes/material.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-clients',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css']
})

export class ClientsPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phone', 'email', 'barcode', 'actions'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // @ts-ignore
  dataSource: MatTableDataSource<Client>
  // @ts-ignore
  loading: boolean
  // @ts-ignore
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter_txt') filter_txt!: ElementRef;

  constructor(private titleService: Title, private clientsServ: ClientsService) {
  }

  ngOnInit() {
    this.titleService.setTitle('OnlineCafe - Клієнти')
    this.loadData()
  }

  loadData(){
    this.loading = true
    this.clientsServ.getAll().subscribe(
      resp => {
        if(resp.success){
          this.dataSource = new MatTableDataSource<Client>(resp.clients)
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

  applyFilter() {
    let filterValue = this.filter_txt.nativeElement.value
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  removeClient(id: string, name: string){
    const askRemove = window.confirm(`Remove client "${name}" ?`)
    if(askRemove) {
      if (id != null) {
        this.clientsServ.remove(id).subscribe(
          resp => {
            if (resp && resp.success) {
              MaterialService.toast('Client was successfully removed!')
              this.loadData()
            } else {
              MaterialService.toast(resp.message)
            }
          },
          error => {
            MaterialService.toast(error.error.message)
          }
        )
      }
    }
  }
}
