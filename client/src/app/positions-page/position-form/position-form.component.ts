import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {finalize, Observable, of, switchMap} from "rxjs";
import {CategoriesResponse, CategoryResponse, Position} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CategoriesService} from "../../shared/services/categories.service";
import {PositionsService} from "../../shared/services/positions.service";

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.css']
})


export class PositionFormComponent implements OnInit {

  // @ts-ignore
  @ViewChild('inputFile') inputFile: ElementRef
  // @ts-ignore
  @ViewChild('chooseParentCat') chooseParentCat: ElementRef
  // @ts-ignore
  curentCatInfo$: Observable<CategoryResponse>
  // @ts-ignore
  backLink$: string
  isNew = true
  // @ts-ignore
  form: FormGroup
  // @ts-ignore
  categoryTree$: Observable<CategoriesResponse>
  // @ts-ignore
  position: Position
  // @ts-ignore
  image: File
  posImg: any
  defaultImg: string = '/uploads/noimage.jpg'

  constructor(private router: Router,
              private catServ: CategoriesService,
              private route: ActivatedRoute,
              private posServ: PositionsService,
              ) {
    this.posImg = this.defaultImg
  }

  ngOnInit(): void {
    this.backLink$ = "/positions/"
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null),
      barcode: new FormControl(null),
      category: new FormControl(null),
    })

    //get cat tree
    this.categoryTree$ = this.catServ.getTree()
    this.categoryTree$
      .subscribe(catResp => {
      //console.log('tree loaded POINT 1')
      setTimeout(()=>{
        //console.log('tree loaded POINT 2')
        MaterialService.initDropdown(this.chooseParentCat)
        //!----------- Timeout reslove ------->
      }, 2000)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.posServ.getById(params['id'])
            } else {
              return of(null)
            }
          }
        )
      ).subscribe(
      posResp => {
        if (posResp && posResp.success) {
          this.position = posResp.position
          this.form.patchValue({
            name: posResp.position.name,
            barcode: posResp.position.barcode,
            cost: posResp.position.cost,
            category: posResp.position.category
          })
          if(posResp.position.category){
            this.curentCatInfo$ = this.catServ.getById(posResp.position.category)
            this.backLink$ = "/positions/" + posResp.position.category
          }
          if (posResp.position.imageSrc) {
            this.posImg = posResp.position.imageSrc
          }
          MaterialService.UpdateTxtFields()
        }

        this.form.enable()
      },
      error => MaterialService.toast(error.error.message))

    this.route.queryParams
      .subscribe(
        params => {
          if (params['parent']) {
            this.curentCatInfo$ = this.catServ.getById(params['parent'])
            this.backLink$ = "/positions/" + params['parent']
            this.form.patchValue({
              category: params['parent']
            })
          }
        }
      )
  }

  triggerClick() {
    this.inputFile.nativeElement.click()
  }

  onFileUpload(event: Event){
    // @ts-ignore
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = () => {
      this.posImg = reader.result
    }

    reader.readAsDataURL(file)
  }

  changeCategory(newCatId: string, newCatName: string){
    this.chooseParentCat.nativeElement.text = newCatName
    this.form.patchValue({
      category: newCatId
    })
  }

  remove(){
    const askRemove = window.confirm(`Remove position "${this.position.name}" ?`)
    if(askRemove) {
      if (this.position._id != null) {
        this.form.disable()
        this.posServ.remove(this.position._id).subscribe(
          posResp => {
            if (posResp && posResp.success) {
              MaterialService.toast('Position was successfully removed!')
              setTimeout(() => {
                this.router.navigate(['/positions'])
              }, 2000)
            } else {
              this.form.enable()
              MaterialService.toast(posResp.message)
            }
          },
          error => {
            this.form.enable()
            MaterialService.toast(error.error.message)
          }
        )
      }else{
        MaterialService.toast('Position ID not found!')
      }
    }
  }

  onSubmit() {
    let obs$
    this.form.disable()
    if(this.isNew){
      //create
      obs$ = this.posServ.create(this.form.value, this.image)
    }else if (this.position._id != null){
      //update
      obs$ = this.posServ.update(this.position._id, this.form.value, this.image)
    }

    // @ts-ignore
    obs$.subscribe(
      posResp => {
        this.form.enable()
        if(posResp && posResp.success){
          MaterialService.toast('Data saved')
          this.position = posResp.position
        }else{
          MaterialService.toast(posResp.message)
        }
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    );
  }

}
