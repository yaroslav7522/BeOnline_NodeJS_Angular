import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService,private router: Router) {
    // @ts-ignore
    this.aSub = null
    // @ts-ignore
    this.form = null
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit(){
    this.form.disable()
    this.aSub = this.auth.registration(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'],
          {queryParams:
                  {registered: true}
          })
      },
      error => {
        this.form.enable()
        //console.warn('Reg error:' + error)
        MaterialService.toast(error.error.message)
      }
    )
  }

}
