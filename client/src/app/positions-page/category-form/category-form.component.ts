import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap, of, Observable} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {CategoriesResponse, Category, CategoryResponse} from "../../shared/interfaces";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('inputFile') inputFile: ElementRef
  // @ts-ignore
  @ViewChild('chooseParentCat') chooseParentCat: ElementRef
  isNew = true
  // @ts-ignore
  form: FormGroup
  // @ts-ignore
  category: Category
  // @ts-ignore
  categoryTree$: Observable<CategoriesResponse>
  // @ts-ignore
  curentCatInfo$: Observable<CategoryResponse>
  // @ts-ignore
  image: File
  defaultImg: string = '/uploads/noimage.jpg'
  catImg: any

  constructor(private route: ActivatedRoute,
              private router: Router,
              private catServ: CategoriesService) {
    this.catImg = this.defaultImg
  }

  ngAfterViewInit() {
    //MaterialService.initDropdown(this.chooseParentCat)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      parent: new FormControl(null),
    })

    this.categoryTree$ = this.catServ.getTree()
    this.categoryTree$.subscribe(catResp => {
      setTimeout(()=>{
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
              return this.catServ.getById(params['id'])
            } else {
              return of(null)
            }
          }
        )
      ).subscribe(
      catResp => {
        if (catResp && catResp.success) {
          this.category = catResp.category
          this.form.patchValue({
            name: catResp.category.name,
            parent: catResp.category.parent
          })
          if(catResp.category.parent){
            this.curentCatInfo$ = this.catServ.getById(catResp.category.parent)
          }
          if (catResp.category.imageSrc) {
            this.catImg = catResp.category.imageSrc
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
            this.form.patchValue({
              parent: params['parent']
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
      this.catImg = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit(){
    let obs$
    this.form.disable()
    if(this.isNew){
      //create
      obs$ = this.catServ.create(this.form.value.name, this.image, this.form.value.parent)
    }else if (this.category._id != null){
      //update
      obs$ = this.catServ.update(this.category._id, this.form.value.name, this.image, this.form.value.parent)
    }

    // @ts-ignore
    obs$.subscribe(
      catResp => {
        this.form.enable()
        if(catResp && catResp.success){
          MaterialService.toast('Data saved')
          this.category = catResp.category
          //if(this.catImgOld){
          //  fs.unlink('./' + this.catImgOld)
          //}
        }else{
          MaterialService.toast(catResp.message)
        }
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    );
  }

  remove(){
    const askRemove = window.confirm(`Remove category "${this.category.name}" ?`)
    if(askRemove) {
      if (this.category._id != null) {
        this.form.disable()
        this.catServ.remove(this.category._id).subscribe(
          catResp => {
            if (catResp && catResp.success) {
              MaterialService.toast('Category was successfully removed!')
              setTimeout(() => {
                this.router.navigate(['/positions'])
              }, 2000)
            } else {
              this.form.enable()
              MaterialService.toast(catResp.message)
            }
          },
          error => {
            this.form.enable()
            MaterialService.toast(error.error.message)
          }
        )
      }else{
        MaterialService.toast('Category ID not found!')
      }
    }
  }

  changeCategory(newCatId: string, newCatName: string){
    /*let newCatInfo$ = this.catServ.getById(newCatId)
    newCatInfo$.subscribe(resp => {
      if(resp.success){
        this.chooseParentCat.nativeElement.text = resp.category.name
        this.form.patchValue({
          parent: newCatId
        })
      }
    })*/
    this.chooseParentCat.nativeElement.text = newCatName
    this.form.patchValue({
      parent: newCatId
    })
  }
}
