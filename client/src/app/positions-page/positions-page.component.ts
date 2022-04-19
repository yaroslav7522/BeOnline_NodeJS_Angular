import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {CategoriesService} from "../shared/services/categories.service";
import {PositionsService} from "../shared/services/positions.service";
import {CategoriesResponse, PositionsResponse} from "../shared/interfaces";
import {Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-positions-page',
  templateUrl: './positions-page.component.html',
  styleUrls: ['./positions-page.component.css']
})
export class PositionsPageComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('floatBtn') floatBtn: ElementRef
  // @ts-ignore
  categories$: Observable<CategoriesResponse>
  // @ts-ignore
  positions$: Observable<PositionsResponse>
  curent_cat_id: string = ''
  breadcrumbs$:  any = []

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private catServ: CategoriesService,
              private posServ: PositionsService,
              private router: Router,
              private ref: ChangeDetectorRef,
              ) {
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  ngAfterViewInit() {
    MaterialService.initFloatingButtons(this.floatBtn)
  }

  ngOnInit(): void {
    this.setDocTitle('OnlineCafe - Номенклатура')

    //--get curent Categories
    this.categories$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if(params['id']){
              this.curent_cat_id = params['id']
              this.catServ.getBreadcrumbs(this.curent_cat_id).then(
                (bc) => {
                  this.breadcrumbs$ = bc
                }
              )
              return this.catServ.fetch(params['id'])
            }else{
              return this.catServ.fetch('')
            }
          }
        )
      )

    this.categories$
      .subscribe(resp=>{
        //--get curent Positions
        this.positions$ = this.posServ.getByCategory(this.curent_cat_id)
        })

  }

  removeCat(catID: string, name: string){
    const askRemove = window.confirm(`Remove category "${name}" ?`)
    if(askRemove) {
      if (catID != null) {
        this.catServ.remove(catID).subscribe(
          catResp => {
            if (catResp && catResp.success) {
              MaterialService.toast('Category was successfully removed!')
              setTimeout(() => {
                //console.log(this.router.url)
                //this.router.navigate([this.router.url)
              }, 2000)
            } else {
              MaterialService.toast(catResp.message)
            }
          },
          error => {
            MaterialService.toast(error.error.message)
          }
        )
      }
    }
  }

  removePos(posID: string, name: string){
    const askRemove = window.confirm(`Remove position "${name}" ?`)
    if(askRemove) {
      if (posID != null) {
        this.posServ.remove(posID).subscribe(
          posResp => {
            if (posResp && posResp.success) {
              MaterialService.toast('POsition was successfully removed!')
              setTimeout(() => {
                //console.log(this.router.url)
                //this.router.navigate([this.router.url)
              }, 2000)
            } else {
              MaterialService.toast(posResp.message)
            }
          },
          error => {
            MaterialService.toast(error.error.message)
          }
        )
      }
    }
  }

  setDocTitle(title: string) {
    this.titleService.setTitle(title);
  }

}
