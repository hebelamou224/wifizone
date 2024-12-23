import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'payment',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export default class PaymentComponent implements OnInit {
  logoOM: string = 'assets/images/orange_money.png';
  logoPaycard: string = 'assets/images/paycard.png';
  logoVisa: string = 'assets/images/visa.png';

  profileId: string = ''; 
  profile: any
  tiket: any

  private tiketSubject = new BehaviorSubject<any>([]);
  tiketData$ = this.tiketSubject.asObservable();
  tiketData: any[];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.tiketData$.subscribe((value)=> this.tiketData=value)
    this.profileId = this.route.snapshot.queryParamMap.get('profileId')!;
    console.log(this.profileId)
    this.getProfile()
  }
  updateData(newValue: any): void {
    this.tiketSubject.next(newValue);
  }

  getProfile(){
    this.apiService.getProfile(this.profileId).subscribe({
      next: (response)=>{
        this.profile = response
        this.updateData(response.tikets)
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

  getFormattedDate(): string {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    const microseconds = '000000';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
  }

  pay(){
    if(this.tiketData.length > 0){
      this.updateData(this.tiketData.filter(tiket=> tiket.status == true))
      if(this.tiketData.length > 0 && this.tiketData[0].status){
        const data = {id: this.tiketData[0].id, status: false, updatedAt: this.getFormattedDate() }
        this.apiService.buyTiket(data).subscribe({
          next: (succes)=>{
            this.msg('Payement effectuctuer avec succes')
            this.router.navigate([`/payment-success`,{ tiketId: `${data.id}` }]);
          },
          error: (error)=>{
            this.errorMsg("Une error s'est produite veuillez ressayer")
          }
        })
      }else{
        this.errorMsg("Auccun tiket n'est disponible pour ce profile pour le moment")
      }
    }else{
      this.errorMsg("Auccun tiket n'est disponible pour ce profile pour le moment")
    }
    this.getProfile()
  }
}
