import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';
import Swal from 'sweetalert2';
import { MsgService } from 'src/app/core/services/msg.service';

@Component({
  selector: 'app-basic-elements',
  standalone: true,
  imports: [SharedModule, NgbDropdownModule, ReactiveFormsModule],
  templateUrl: './basic-elements.component.html',
  styleUrls: ['./basic-elements.component.scss']
})
export default class BasicElementsComponent implements OnInit {

  userInfo: FormGroup
  passwordForm: FormGroup
  userSubject = new BehaviorSubject(null)
  user$ = this.userSubject.asObservable()
  user: any


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msgService: MsgService,
    private localStorage: LocalServiceStorage
  ){
    this.userInfo = this.fb.group({
      username: [''],
      fullname: [''],
      email: ['', Validators.email],
      contact: [''],
      address: [''],
      status: [false]
    })
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordsMatchValidator });
    this.user$.subscribe(value=> this.user = value)
  }
  ngOnInit(): void {
    if(this.localStorage.getUserId()){
      this.userService.getUser(this.localStorage.getUserId()).subscribe({
        next: (user)=>{
          // this.updateUser(user)
          this.initUserValue(user)
        },
        error: (error)=>{}
      })
    }
  }

  get f() {
    return this.passwordForm.value
  }
  passwordsMatchValidator(form: AbstractControl): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    const oldPassword = form.get('oldPassword')?.value;
    if (password !== confirmPassword && oldPassword != '') {
      return { passwordsMismatch: true };
    }
    return null;
  }


  updateUser(user){
    this.userSubject.next(user)
  }
  initUserValue(user){
    this.userInfo.get('username').setValue(user.username)
    this.userInfo.get('fullname').setValue(user.fullname)
    this.userInfo.get('status').setValue(user.status)
    this.userInfo.get('email').setValue(user.email) 
    this.userInfo.get('address').setValue(user.address)
    this.userInfo.get('contact').setValue(user.contact)
  }
 

  save(){
    this.userService.update(this.localStorage.getUserId(), this.userInfo.value).subscribe({
      next: (data)=>{},
      error: (error)=>{}
    })
  }

  update(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "⚠️ Vous confirmer la modification des informations",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, Modifier!",
      cancelButtonText: "Non, Annuler!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.save()
        swalWithBootstrapButtons.fire({
          title: "Registred!",
          text: "Mofification effectuer avec succes.",
          icon: "success"
        });
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Vous avez annuler la modification 😃",
          icon: "error"
        });
      }
    });
  }

  

  changePassword(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "⚠️ Et vous d'accord de modifier votre mot de pass?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, Modifier!",
      cancelButtonText: "Non, Annuler!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.passwordForm.valid){
          this.userService.resetPassword(this.localStorage.getUserId(), this.passwordForm.value).subscribe({
            next: (res)=>{
              console.log(res)
              this.msgService.msgSucces(res.message, res.title)
              this.passwordForm.reset()
            },
            error: (error)=>{
              console.log('update password', error)
              this.msgService.error(error.error.message, error.error.title)
              
            }
          })
        }
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Vous avez annuler la modification 😃",
          icon: "error"
        });
      }
    });
  }

}
