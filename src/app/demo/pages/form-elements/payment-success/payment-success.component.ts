import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { MsgService } from 'src/app/core/services/msg.service';

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
    private msgService: MsgService
  ) { }
  ngOnInit(): void {
    this.tiketData$.subscribe((value)=> this.tiket=value)
    // this.tiketId = this.route.snapshot.queryParamMap.get('tiketId')!;
     this.tiketId = this.route.snapshot.paramMap.get('tiketId')!;
    this.getTiket()
  }
  updateData(newValue: any): void {
    this.tiketSubject.next(newValue);
  }
 
  getTiket(){
    this.apiService.getTiket(this.tiketId).subscribe({
      next: (tiket)=>{
        this.updateData(tiket)
      },
      error: (error)=>{}
    })
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
      // this.topLetfMsg('Login et mot de pass copier!')
      this.msgService.topLetfMsg('Login et mot de pass copier!')
    } catch (err) {
      console.error('Erreur lors de la copie : ', err);
      // this.errorMsg("Une error s'est produite l'ors du copie")
      this.msgService.errorMsg(err.error.title,"Une error s'est produite l'ors du copie")
    }
    document.body.removeChild(textArea); 
  }

}
