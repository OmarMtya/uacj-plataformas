import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isIframe = false;
  loginDisplay = false;

  constructor(
    private authService: MsalService,
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('msal.interaction.status')) {

    }
  }

  login() {
    this.authService.loginRedirect();
  }

  getAno() {
    return new Date().getFullYear();
  }

}
