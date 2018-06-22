import { Router, ActivatedRoute, ParamMap, NavigationEnd, RouterEvent, RoutesRecognized } from '@angular/router';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RoutingHistoryService {

  private history = [];

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // if (this.history.indexOf(urlAfterRedirects) < 0)
          this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    if (this.history.length > 2) {
      return this.history[this.history.length - 2];
    }
  }
}
