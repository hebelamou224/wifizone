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
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export default class SettingsProfile implements OnInit {

  companyForm: FormGroup
  passwordForm: FormGroup
  selectedFile: File | null = null;
  currencyForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msgService: MsgService,
    private localStorage: LocalServiceStorage,
  ){
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      nameDirector: [''],
      documentJustify: [''],
      email: ['', [Validators.email, Validators.required]],
      contact: ['', Validators.required],
      nif: [''],
      address: [''],
      logo: [''],
    })
    this.currencyForm = this.fb.group({
      currency: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    
    if(this.localStorage.getUser()){
      if(this.localStorage.getCompanyId()){
        this.userService.getCompany(this.localStorage.getCompanyId()).subscribe({
          next: (company)=>{
            this.initCompanyValue(company)
          },
          error: (error)=>{}
        })
      }
    }
  }

  updateCompanyInfo(){
    if(this.companyForm.valid){
      console.log(this.companyForm.value)
      this.companyForm.value.userId = this.localStorage.getUserId()
      console.log(this.companyForm.value)
      const formData = new FormData()
      formData.append('name', this.companyForm.value.name)
      formData.append('nameDirector', this.companyForm.value.nameDirector)
      formData.append('documentJustify', this.companyForm.value.documentJustify)
      formData.append('email', this.companyForm.value.email)
      formData.append('contact', this.companyForm.value.contact)
      formData.append('nif', this.companyForm.value.nif)
      formData.append('userId', this.localStorage.getUserId())
      formData.append('address', this.companyForm.value.address)
      if(this.selectedFile)
        formData.append('logo', this.selectedFile)

      this.userService.updateCompanyInfo(formData).subscribe({
        next: (res)=>{
          this.msgService.msgSucces(res.message, res.title)
        },
        error: (error)=>{
          this.msgService.error(error.error.message, error.error.title)
        }
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  currencyUpdate(){
    if(this.currencyForm.valid && this.localStorage.getUserId()){
      this.userService.updateCurrency(this.localStorage.getUserId(), this.currencyForm.value).subscribe({
        next: (res)=>{
          this.msgService.msgSucces(res.message, res.title)
        },
        error: (error)=>[
          this.msgService.error(error.error.message, error.error.title)
        ]
      })
    }
  }

  initCompanyValue(company){
    this.companyForm.get('name').setValue(company.name)
    this.companyForm.get('nameDirector').setValue(company.nameDirector)
    this.companyForm.get('nif').setValue(company.nif)
    this.companyForm.get('email').setValue(company.email) 
    this.companyForm.get('address').setValue(company.address)
    this.companyForm.get('contact').setValue(company.contact)
  }
}
