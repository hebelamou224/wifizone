import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { LocalServiceStorage } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-breadcrumb-paging',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './breadcrumb-paging.component.html',
  styleUrls: ['./breadcrumb-paging.component.scss'],
  providers: [NgbModalConfig, NgbModal],
})
export default class BreadcrumbPagingComponent implements OnInit {
  profiles: any[] = []
  tiketForm: FormGroup;
  profile: any
  profileId: any = ''
  tikets: any[] = []

  private profileSubject = new BehaviorSubject<any>(new Object());
  profileData$ = this.profileSubject.asObservable();
  profileData: any;

  constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
    private apiService: ApiService,
    private fb: FormBuilder,
    private localStorageService: LocalServiceStorage
	) {
		config.backdrop = 'static';
		config.keyboard = false;
    this.tiketForm = this.fb.group({
      profileId: ['', Validators.required],
      price: [''],
      // files: ['']
    });
    this.profileData$.subscribe((value)=>{this.profileData = value})
	}
  ngOnInit(): void {
    this.loadingProfiles();
  }

  updateData(newValue: any): void {
    this.profileSubject.next(newValue);
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement; 
    const files = input?.files;  
    if (files && files.length > 0) {
      this.readCSV(files[0]);  
    }
  }

  readCSV(file: File) {
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      const csvData = event.target.result;
      this.parseCSV(csvData);  // Appeler la méthode pour parser le contenu CSV
    };

    reader.readAsText(file);  // Lire le fichier comme texte
  }

  parseCSV(csvData: string) {
    const lines = csvData.split('\n');  // Séparer les lignes du fichier CSV
    const headers = lines[0].split(';').map(header => header.trim());  // Récupérer les entêtes des colonnes et enlever les espaces superflus
    const rows = lines.slice(1);  // Récupérer les données sans la première ligne

    this.tikets = rows.map(row => {
      const values = row.split(';').map(value => value.trim());  // Séparer chaque ligne en valeurs et supprimer les espaces
      const obj: { [key: string]: string | number } = {};

      headers.forEach((header, index) => {
        let value = values[index];

        // Convertir en nombre si c'est un nombre
        // if (!isNaN(Number(value))) {
        //   value = Number(value);
        // }

        obj[header] = value;  // Ajouter la clé/valeur dans l'objet
      });
      return obj;
    });

    console.log('Données CSV parsées:', this.tikets);
  }

  loadingProfiles(){
    const userId = this.localStorageService.getUserId()
    if(userId){
      this.apiService.getProfiles(userId).subscribe({
        next: (data) => {
          console.log('Profiles:', data);
          this.profiles = data;
          if(this.profiles.length > 0){
            this.updateData(this.profiles[0])
          }
        },
        error: (error) => {console.error('Erreur lors du chargement des profils:', error);},
      });
    }
  }

  loadingProfile(profileId){
    this.apiService.getProfile(profileId).subscribe({
      next: (data) => {
        // console.log('profile:', data);
        // this.profile = data;
        this.updateData(data)
      },
      error: (error) => {
        console.error('Erreur lors du chargement des profile:', error);
      },
    });
  }


  open(content) {
		this.modalService.open(content);
	}

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.profileId = selectElement.value;
    this.loadingProfile(this.profileId)
  }

  onSubmit(close: any) {
    if (this.tiketForm.valid) {
      close('Form submitted'); 
      const newTikets = this.tiketForm.value;
      console.log(newTikets)
      if(this.tikets.length > 0){
        this.tikets = this.tikets.map((t)=>{
          t['profileId'] = this.tiketForm.value.profileId
          if(t['login'] && t['password'])
            return t;
        })
        // console.log(this.tikets)
        this.apiService.importTikets(this.tikets).subscribe({
          next: (data) => {
            // console.log(`succesfull: `,data)
            Swal.fire({
              title: `Successfull`,
              text: `Import tikets successfull`,
              icon: 'success',
              confirmButtonText: 'Okay'
            });
            // this.loadingProfile(this.tiketForm.value.profileId);
          },
          error: (error) => {
            this.errorMsg('Something went wrong!')
            console.error('Erreur lors de la création du profil:', error);
          },
        });
        this.tiketForm.reset({
          profileId: "",
          price: "",
          files: null
        })
      }else{
        this.errorMsg('Le fichier ne contient aucun elements ou le format est incorrect')
      }
      
    }
  }

  errorMsg(message){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${message}`,
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  }
}
