import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'anna-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  videoIcon = "..\\content\\images\\stop.png";
  play = "Play";
  videodisabled = true;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {}

  changeImg(): void{
    if(this.play === "Play")
    {
      this.play = "Pause",
        this.videoIcon = "..\\content\\images\\play.png",
        this.videodisabled = false
    }
    else
    {
      this.videoIcon = "..\\content\\images\\stop.png",
        this.play = "Play",
        this.videodisabled = true
    }
  }


  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
