import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: MsalService) { }

  ngOnInit(): void {
    this.authService.loginPopup()
      .subscribe((result) => {
        console.log(result);
      });
  }

  getAno() {
    return new Date().getFullYear();
  }

}
