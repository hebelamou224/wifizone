import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MsgService } from 'src/app/core/services/msg.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export default class AuthSignupComponent implements OnInit {

  signupForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msgService: MsgService,
    private router: Router,
  ){
    this.signupForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
      email: ['', [Validators.required,Validators.email]],
      btnCheckSaveDetail: [true],
      btnCheckNewsletter: [true]
    })
  }
  ngOnInit(): void {
  }

  onSubmit(){
    if(this.signupForm.valid){
      this.createUser(this.signupForm.value)
    }
  }

  get username(){
    return this.signupForm.get('username')
  }
  get password(){return this.signupForm.get('password')}
  get email(){return this.signupForm.get('email')}

  async createUser(user): Promise<any>{
    this.userService.createUser(user).subscribe({
      next: (us)=>{
        this.msgService.msgSucces("Votre compte a ete creer avec succes")
        this.router.navigate([`/auth/signin`,{ username: us.username}]);
      },
      error: (error)=>{
        this.msgService.errorMsg(error.error.title, error.error.message)
      }
    })
  }

}
