import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MaterialService} from "../../classes/material.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Position} from "../../interfaces";
import {PositionsService} from "../../services/positions.service";

// @ts-ignore
@Component({
  selector: 'app-select-position',
  templateUrl: './select-position.component.html',
  styleUrls: ['./select-position.component.css']
})

export class SelectPositionComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'barcode', 'cost'];
  // @ts-ignore
  @ViewChild('modal_positions') public modal_positions: ElementRef
  // @ts-ignore
  dataSource: MatTableDataSource<Position>
  loaded: boolean
  row_index: number
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter_txt') filter_txt!: ElementRef;
  @Output("parentComp") parentComp = new EventEmitter<any>();

  constructor(private posServ: PositionsService) {
      this.loaded = false
      this.row_index = 0
  }

  ngAfterViewInit() {
    MaterialService.InitPopup(this.modal_positions)
  }

  openModal( row_index: number){
    this.row_index = row_index
    if(!this.dataSource){
      this.loadData()
    }
    let instance = MaterialService.getPopupInstance(this.modal_positions);
    instance.open()
  }

  close() {
    let instance = MaterialService.getPopupInstance(this.modal_positions);
    instance.close()
  }

  loadData(){
    this.posServ.getAll().subscribe(
      resp => {
        if(resp.success){
          this.dataSource = new MatTableDataSource<Position>(resp.positions)
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

  selectRow(element: Position){
    this.parentComp.emit({ position: element, index: this.row_index })
    this.close()
  }
}
