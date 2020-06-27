import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'firebase/app';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() user!: User;
  @Output() logoutClick: EventEmitter<null> = new EventEmitter<null>();
  constructor() { }

  logout(): void {
    this.logoutClick.emit();
  }
}
