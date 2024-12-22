import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/services/api.service';
import { ArraySizePipe } from 'src/app/core/pipes/array-size.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-badge',
  standalone: true,
  imports: [SharedModule, ArraySizePipe,SweetAlert2Module],
  templateUrl: './basic-badge.component.html',
  styleUrls: ['./basic-badge.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export default class BasicBadgeComponent implements OnInit{
  profiles: any[] = [];
  wifizones: any[] = []
  link: string = 'link here'
  
  profileForm: FormGroup;
  submitted = false;
  isModalOpen = false; 

  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
    private apiService: ApiService,
    private fb: FormBuilder
	) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      wifiZoneId: ['', Validators.required],
      timeLimit: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['']
    });
	}
  ngOnInit(): void {
    this.loadProfiles();
    this.loadWiFiZones();
  }

  open(content) {
		this.modalService.open(content);
	}

  loadProfiles(): void {
    this.apiService.getProfiles().subscribe({
      next: (data) => {
        console.log('Profiles:', data);
        this.profiles = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des profils:', error);
      },
    });
  }

  loadWiFiZones(): void {
    this.apiService.getWiFiZones().subscribe({
      next: (data) => {
        console.log('WiFiZone:', data);
        this.wifizones = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des WiFiZone:', error);
        this.errorMsg()
      },
    });
  }

  deleteProfile(id){
    this.apiService.deleteProfile(id).subscribe({
      next:(response)=>{
        console.log(`delete: `,response)
        // this.topLetfMsg('This profile was deleted')
        this.loadProfiles(); 
      },
      error: (error)=>{this.errorMsg()}
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
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProfile(id)
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }

  onSubmit(close: any) {
    this.createProfile(close);
  }

  createProfile(close: any): void {
    if (this.profileForm.valid) {
      close('Form submitted'); 
      const newProfile = this.profileForm.value;
      this.apiService.createProfile(newProfile).subscribe({
        next: (data) => {
          console.log(`succesfull: `,data)
          Swal.fire({
            title: `Successfull`,
            text: `Profile ${newProfile.name} created successfull`,
            icon: 'success',
            confirmButtonText: 'Okay'
          });
          this.loadProfiles();
        },
        error: (error) => {
          this.errorMsg()
          console.error('Erreur lors de la création du profil:', error);
        },
      });
      this.profileForm.reset({
        name: '',
        timeLimit: '',
        price: '',
        comment: '',
        wifiZoneId: ''
      })
    }
  }

  errorMsg(){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  }
  topLetfMsg(message){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${message}`,
      showConfirmButton: false,
      timer: 1500
    });
  }

  copyToClipboard(profile): void {
    const textArea = document.createElement('textarea');
    textArea.value = profile.id;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.topLetfMsg('Texte copié dans le presse-papiers !')
    } catch (err) {
      console.error('Erreur lors de la copie : ', err);
      this.errorMsg()
    }
    document.body.removeChild(textArea); 
  }


}
