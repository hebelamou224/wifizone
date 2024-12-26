// angular import
import { Component, OnInit } from '@angular/core';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit{
  user: any

  constructor(
    private readonly localStorageService: LocalServiceStorage
  ){}
  ngOnInit(): void {
    if(this.localStorageService.getUser())
      this.user = this.localStorageService.getUser()
  }

  logout(){
    this.localStorageService.clear()
    window.location.reload()
  }
}
