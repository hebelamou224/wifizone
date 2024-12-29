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
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export default class AdminUserComponent implements OnInit {
 
  usersSubject = new BehaviorSubject([])
  users$ = this.usersSubject.asObservable()
  users: any[]

  constructor(
    private wifizoneService: WiFiZoneService,
    private msgService: MsgService,
    private localStorageService: LocalServiceStorage,
    private userService: UserService,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
  ){
    this.users$.subscribe(value=>this.users=value)
  }

  ngOnInit(): void {
    this.loadUsers()
  }

  updateUsers(value){
    this.usersSubject.next(value)
  }
  
  loadUsers(){
    this.userService.getUsers().subscribe({
      next: (users)=>{
        console.log(users)
        this.updateUsers(users)
      }
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
        // this.deleteWifizone(id)
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
  locked(id, isLocked){
    this.userService.update(id,{isLocked: !isLocked}).subscribe({
      next: (res)=>{
        this.msgService.topLetfMsg('Operation successfull')
        this.loadUsers()
      }
    })
  }
  disabled(id, status){
    this.userService.update(id,{status: !status}).subscribe({
      next: (res)=>{
        this.msgService.topLetfMsg('Operation successfull')
        this.loadUsers()
      }
    })
  }
  changeProfile(id, profile){
    if(profile == 'admin')
      profile = 'user'
    else
      profile = 'admin'
    this.userService.update(id,{profile}).subscribe({
      next: (res)=>{
        this.msgService.topLetfMsg(res.message)
        this.loadUsers()
      }
    })
  }

  updateFrees(idCompte, compte){
    Swal.fire({
      title: 'Update frees policy',
      input: 'number', // Type de champ : "text", "email", "password", etc.
      inputPlaceholder: `Enter the frees. i.e: ${compte.frees}`,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log('Valeur saisie :', result.value); 
        compte.frees = result.value
        console.log(compte, 'compte update')
        this.userService.updateFrees(idCompte, compte).subscribe({
          next: (res)=>{
            this.msgService.topLetfMsg(res.message)
            this.loadUsers()
          }
        })
        // Swal.fire('Succès', `Vous avez saisi : ${result.value}`, 'success');
      } else if (result.isDismissed) {
        console.log('Saisie annulée');
      }
    });
  }

}
