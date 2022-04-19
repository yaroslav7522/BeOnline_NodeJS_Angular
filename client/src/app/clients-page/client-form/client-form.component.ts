import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {finalize, of, switchMap} from "rxjs";
import {Client} from "../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ClientsService} from "../../shared/services/clients.service";
import {MaterialService} from "../../shared/classes/material.service";
import { format } from 'date-fns'

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('datepicker') datepicker: ElementRef
  dpLoaded: boolean = false
  // @ts-ignore
  form: FormGroup
  // @ts-ignore
  client: Client
  isNew = true
  bdate: Date = new Date()

  constructor(private router: Router,
              private clientServ: ClientsService,
              private route: ActivatedRoute,
              ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      email: new FormControl(null, Validators.email),
      barcode: new FormControl(null),
      bdate: new FormControl(null),
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.clientServ.getById(params['id'])
            } else {
              return of(null)
            }
          }
        )
      ).subscribe(
        clResp => {
          if (clResp) {
            if (clResp.success) {
              this.client = clResp.client
              this.form.patchValue({
                name: clResp.client.name,
                phone: clResp.client.phone,
                email: clResp.client.email,
                barcode: clResp.client.barcode,
                bdate: clResp.client.bdate?format(new Date(clResp.client.bdate), 'dd.MM.yyyy'):'',
              })
              if(clResp.client.bdate){
                this.bdate = new Date(clResp.client.bdate)
              }
              MaterialService.UpdateTxtFields()
            }
          }

          if(this.datepicker){
            MaterialService.initDatepicker(this.datepicker, this.bdate)
            this.dpLoaded = true
          }
          this.form.enable()
        },
      error => MaterialService.toast(error.error.message))
  }

  ngAfterViewInit() {
    if(!this.dpLoaded){
      MaterialService.initDatepicker(this.datepicker)
    }
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if(this.datepicker.nativeElement.value){
      this.form.patchValue({
        bdate: new Date(this.datepicker.nativeElement.value)
      })
    }

    if(this.isNew){
      //create
      obs$ = this.clientServ.create(this.form.value)
    }else if (this.client._id != null){
      //update
      obs$ = this.clientServ.update(this.client._id, this.form.value)
    }

    // @ts-ignore
    obs$.subscribe(
      Resp => {
        this.form.enable()
        if(Resp && Resp.success){
          MaterialService.toast('Data saved')
          this.client = Resp.client
        }else{
          MaterialService.toast(Resp.message)
        }
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    );
  }

  remove(){
    const askRemove = window.confirm(`Remove client "${this.client.name}" ?`)
    if(askRemove) {
      if (this.client._id != null) {
        this.form.disable()
        this.clientServ.remove(this.client._id).subscribe(
          clResp => {
            if (clResp && clResp.success) {
              MaterialService.toast('Client was successfully removed!')
              setTimeout(() => {
                this.router.navigate(['/clients'])
              }, 2000)
            } else {
              this.form.enable()
              MaterialService.toast(clResp.message)
            }
          },
          error => {
            this.form.enable()
            MaterialService.toast(error.error.message)
          }
        )
      }else{
        MaterialService.toast('Client ID not found!')
      }
    }
  }
}
