import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ArraySizePipe } from 'src/app/core/pipes/array-size.pipe';
import { ApiService } from 'src/app/core/services/api.service';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';
import { MsgService } from 'src/app/core/services/msg.service';
import { UserService } from 'src/app/core/services/user.service';
import { WiFiZoneService } from 'src/app/core/services/wifizone.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule, RouterModule, ArraySizePipe],
  templateUrl: './wifizones.component.html',
  styleUrls: ['./wifizones.component.scss']
})
export default class AdminWifizonesComponent implements OnInit {
  wifizonesSuject = new BehaviorSubject([])
  wifizones$ = this.wifizonesSuject.asObservable()
  wifizones: any[]

  profilesSubject = new BehaviorSubject([])
  profiles$ = this.profilesSubject.asObservable()
  profiles: any[]

  usersSubject = new BehaviorSubject([])
  users$ = this.usersSubject.asObservable()
  users: any[]

  userId: string

  constructor(
    private wifizoneService: WiFiZoneService,
    private msgService: MsgService,
    private localStorageService: LocalServiceStorage,
    private userService: UserService,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
  ){
    this.wifizones$.subscribe(value=>this.wifizones=value)
    this.users$.subscribe(value=>this.users=value)
    this.profiles$.subscribe(value=>this.profiles=value)
  }

  ngOnInit(): void {
    this.loadWiFiZones()
    this.loadUsers()
  }

  updateWifizone(value){
    this.wifizonesSuject.next(value)
  }
  updateUsers(value){
    this.usersSubject.next(value)
  }
  updateProfiles(value){
    this.profilesSubject.next(value)
  }

  loadUsers(){
    this.userService.getUsers().subscribe({
      next: (users)=>{
        this.updateUsers(users)
      }
    })
  }

  loadWiFiZones(): void {
    const userId = this.localStorageService.getUserId()
    if(userId){
      this.wifizoneService.getWiFiZones(userId).subscribe({
        next: (data) => {
          // console.log(data)
          this.updateWifizone(data)
        },
        error: (error) => {
          console.error('Erreur lors du chargement des WiFiZone:', error);
          if(error.status === 401)
            this.msgService.errorMsg("Access denied", "Your session has expired, try connect again")
          else
            this.msgService.errorMsg()
        },
      });
    }
  }

  deleteWifizone(id){
    this.wifizoneService.deleteWiFiZone(id).subscribe({
      next:(response)=>{
        this.loadWiFiZones(); 
      },
      error: (error)=>{this.msgService.error()}
    })
  }

  delete(id){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "⚠️ Si vous supprimer ce wifizone tout les profiles et tikets liee a ce wifizone seront supprimer egalement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteWifizone(id)
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Wifizone supprimer avec succes.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Vous avez annuler la suppression 😃",
          icon: "error"
        });
      }
    });
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortByusername(selectElement.value)
    this.loadProfile(selectElement.value)
    this.userId = selectElement.value
  }
  onSelectChangeWifizone(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortByWifizone(selectElement.value)
  }

  sortByWifizone(wifizoneId){
    this.apiService.getProfiles(this.userId).subscribe({
      next: (profiles)=>{
        if(wifizoneId != 'all')
          profiles = profiles.filter(profile=>{return profile.wifiZone.id == wifizoneId? profile:null})
        this.updateProfiles(profiles)
      }
    })
  }

  loadProfile(userId){
    this.apiService.getProfiles(userId).subscribe({
      next: (profiles)=>{
        this.updateProfiles(profiles)
      }
    })
  }

  sortByusername(idUser){
    const userId = this.localStorageService.getUserId()
    if(userId){
      this.wifizoneService.getWiFiZones(userId).subscribe({
        next: (data) => {
          if(idUser != 'all')
            data = data.filter(wifi=>{return wifi.user.id === idUser? wifi: null})
          this.updateWifizone(data)
        },
        error: (error) => {},
      });
    }
  }

  copyToClipboard(profile): void {
    const textArea = document.createElement('textarea');
    textArea.value = `${this.document.location.origin}/payment?profileId=${profile.id}`;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.msgService.topLetfMsg('Copy link now')
    } catch (err) {
      this.msgService.errorMsg()
    }
    document.body.removeChild(textArea); 
  }
}
