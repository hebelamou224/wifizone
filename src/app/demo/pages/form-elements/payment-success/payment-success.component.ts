import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'payment-success',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export default class PaymentSuccessComponent implements OnInit {
  tiketId: string = ''; 
  tiket: any

  private tiketSubject = new BehaviorSubject<any>([]);
  tiketData$ = this.tiketSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) { }
  ngOnInit(): void {
    this.tiketData$.subscribe((value)=> this.tiket=value)
    // this.tiketId = this.route.snapshot.queryParamMap.get('tiketId')!;
     this.tiketId = this.route.snapshot.paramMap.get('tiketId')!;
     console.log('Tiket ID: ', this.tiketId)
    this.getTiket()
  }
  updateData(newValue: any): void {
    this.tiketSubject.next(newValue);
  }
 
  getTiket(){
    this.apiService.getTiket(this.tiketId).subscribe({
      next: (tiket)=>{
        console.log(tiket)
        this.updateData(tiket)
      },
      error: (error)=>{}
    })
  }

  msg(msg='Accune action pour le moment'){
    Swal.fire({
      title: `Successfull`,
      text: `${msg}`,
      icon: 'success',
      confirmButtonText: 'Okay'
    });
  }

  errorMsg(msg){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${msg}`,
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  }

  copyToClipboard(tiket): void {
    const textArea = document.createElement('textarea');
    textArea.value = `Login: ${tiket.login}, ModPass: ${tiket.password}`;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.topLetfMsg('Login et mot de pass copier!')
    } catch (err) {
      console.error('Erreur lors de la copie : ', err);
      this.errorMsg("Une error s'est produite l'ors du copie")
    }
    document.body.removeChild(textArea); 
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

}
