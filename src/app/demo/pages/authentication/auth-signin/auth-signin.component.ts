import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';
import { MsgService } from 'src/app/core/services/msg.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {
  signinForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private msgService: MsgService,
    private router: Router,
    private localServiceStorage: LocalServiceStorage
  ){
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      btnRemember: [true]
    })
  }
  ngOnInit(): void {
    this.signinForm.get('username').setValue(this.route.snapshot.paramMap.get('username')!)
    this.signinForm.get('password').setValue(this.route.snapshot.paramMap.get('password')!)
  }
  get username(){return this.signinForm.get('username')}
  get password(){return this.signinForm.get('password')}
  
  onSubmit(){
    if(this.signinForm.valid){
      this.singin(this.signinForm.value)
    }
  }

  singin(auth){
    this.authService.signin(auth).subscribe({
      next: (payload)=>{
        this.authService.login()
        this.localServiceStorage.clear()
        this.localServiceStorage.setItem('user',payload)
        this.localServiceStorage.setItem('token',payload.token)
        this.msgService.topLetfMsg(`Bienvenu ${payload.username}`)
        // this.msgService.msgSucces('Authentification reussie', )
        this.router.navigate([`/dashboard`]);
      },
      error: (error)=>{
        console.log(error)
        this.msgService.errorMsg(error.error.title, error.error.message)
      }
    })
  }
}
