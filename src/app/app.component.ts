import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private unsubscribe = new Subject<void>();

  constructor() {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  onSubmit(): void {
    alert('submitted');
  }
}
