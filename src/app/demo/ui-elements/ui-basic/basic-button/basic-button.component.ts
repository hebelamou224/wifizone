import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { WiFiZoneService } from 'src/app/core/services/wifizone.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-button',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './basic-button.component.html',
  styleUrls: ['./basic-button.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export default class BasicButtonComponent implements OnInit {
  wifizones: any[]=[]
  wifizoneForm: FormGroup;
  submitted = false;

  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
    private wifizoneService: WiFiZoneService,
    private fb: FormBuilder
	) {
		config.backdrop = 'static';
		config.keyboard = false;
    this.wifizoneForm = this.fb.group({
      name: ['', Validators.required],
      dnsName: [''],
      comment: [''],
      contact: ['']
    });
	}
  ngOnInit(): void {
    this.loadWiFiZones()
  }
  open(content) {
		this.modalService.open(content);
	}

  loadWiFiZones(): void {
    this.wifizoneService.getWiFiZones().subscribe({
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

  onSubmit(close: any) {
    if (this.wifizoneForm.valid) {
      close('Form submitted'); 
      const newWifizone = this.wifizoneForm.value;
      console.log(`data: `, newWifizone)
      this.wifizoneService.createWiFiZone(newWifizone).subscribe({
        next: (data) => {
          console.log(`succesfull: `,data)
          Swal.fire({
            title: `Successfull`,
            text: `wifizone ${newWifizone.name} created successfull`,
            icon: 'success',
            confirmButtonText: 'Okay'
          });
          this.loadWiFiZones();
        },
        error: (error) => {
          this.errorMsg()
          console.error('Erreur lors de la création du wifizone:', error);
        },
      });
      this.wifizoneForm.reset({
        name: '',
        dnsName: '',
        comment: '',
        contact: ''
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

  deleteWifizone(id){
    this.wifizoneService.deleteWiFiZone(id).subscribe({
      next:(response)=>{
        this.loadWiFiZones(); 
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
}
