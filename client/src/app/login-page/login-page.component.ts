import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit,OnDestroy {

  form: FormGroup
  aSub: Subscription

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
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

    this.route.queryParams.subscribe((params: Params) => {
      if(params['registered']){
        //You can login now
        MaterialService.toast('You can login now')
      }else if(params['accessDenied']){
        //Login need
        MaterialService.toast('Login need')
      }else if(params['sessionEnd']){
        MaterialService.toast('Login need')
      }
    })
  }

  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    /*const user = {
      email: this.form.value.email,
      password: this.form.value.password,
    }*/
    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        //console.log('Login sucess')
        this.router.navigate(['/overview'])
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
        //console.warn('Login error:' + error)
      }
    )
  }

}
