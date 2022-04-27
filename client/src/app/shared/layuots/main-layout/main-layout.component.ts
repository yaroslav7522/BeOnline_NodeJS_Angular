import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild('leftMenu') public leftMenu: ElementRef
  // @ts-ignore
  @ViewChild('collapsible') public collapsible: ElementRef

  constructor(private auth: AuthService, private router: Router) { }

  logout(){
    this.auth.logout()
    this.router.navigate(['/login'])
  }

  ngAfterViewInit() {
    //MaterialService.InitLeftMenu(this.leftMenu)
    MaterialService.InitDropdownMenu(this.collapsible)
  }

}
