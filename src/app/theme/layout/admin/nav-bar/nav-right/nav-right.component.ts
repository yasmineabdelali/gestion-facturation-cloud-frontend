import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/services/auth';
import { NotificationsService } from 'src/app/services/notifications';

@Component({
  selector: 'app-nav-right',
  imports: [CommonModule, RouterLink, DecimalPipe, NgbDropdownModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit {
  visibleUserList = false;
  chatMessage = false;
  friendId!: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.notificationsService.charger();
  }

  onChatToggle(friendID: number): void {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}