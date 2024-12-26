// angular import
import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  // public props
  @Input() item: NavigationItem;
  role: string

  // constructor
  constructor(private location: Location, private localStorage: LocalServiceStorage) {}

  // life cycle event
  ngOnInit() {
    const user: any = this.localStorage.getItem('user')
    if(user)
      this.role = user.profile;
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
