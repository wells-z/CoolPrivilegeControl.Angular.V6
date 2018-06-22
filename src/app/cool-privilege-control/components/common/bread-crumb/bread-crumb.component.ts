import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
// import { CookieStorage, LocalStorage, SessionStorage,TempStorage } from 'ngx-store';
import { LocalStorage, SessionStorage } from 'ngx-webstorage';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Event, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { BreadCrumb } from "./bread-crumb";


@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  @LocalStorage()
  LangPack: any;

  @LocalStorage()
  LangKey: string;

  public breadcrumbs = new Array<BreadCrumb>();

  constructor(private router: Router) {
    this.router.events.subscribe((routeEvent) => { this.onRouteEvent(routeEvent); });
  }

  public changeBreadcrumb(route: ActivatedRouteSnapshot, name: string) {
    const rootUrl = this.createRootUrl(route);
    const breadcrumb = this.breadcrumbs.find(function (bc) { return bc.url === rootUrl; });

    if (!breadcrumb) { return; }

    if (this.LangPack.hasOwnProperty(name))
      breadcrumb.label = this.LangPack[name];
    else
      breadcrumb.label = name;

    // this.breadcrumbChanged.emit(this.breadcrumbs);
  }

  private onRouteEvent(routeEvent: Event) {
    if (!(routeEvent instanceof NavigationEnd)) { return; }

    let route = this.router.routerState.root.snapshot;
    let url = '';

    this.breadcrumbs = [];

    while (route.firstChild != null) {
      route = route.firstChild;

      if (route.routeConfig === null) { continue; }
      if (!route.routeConfig.path) { continue; }

      url += `/${this.createUrl(route)}`;

      if (!route.data['breadcrumb']) { continue; }

      this.breadcrumbs.push(this.createBreadcrumb(route, url));
    }

    // this.breadcrumbChanged.emit(this.breadcrumbs);
  }

  private createBreadcrumb(route: ActivatedRouteSnapshot, url: string): BreadCrumb {

    let breadCrumbLabel = "";

    let name = route.data['breadcrumb'];

    if (this.LangPack != null && this.LangPack.hasOwnProperty(name))
      breadCrumbLabel = this.LangPack[name];
    else
      breadCrumbLabel = name;

    return {
      label: breadCrumbLabel,
      // terminal: this.isTerminal(route),
      url: url
    }
  }

  private isTerminal(route: ActivatedRouteSnapshot) {
    return route.firstChild === null
      || route.firstChild.routeConfig === null
      || !route.firstChild.routeConfig.path;
  }

  private createUrl(route: ActivatedRouteSnapshot) {
    return route.url.map(function (s) { return s.toString(); }).join('/');
  }

  private createRootUrl(route: ActivatedRouteSnapshot) {
    let url = '';
    let next = route.root;

    while (next.firstChild !== route && next.firstChild !== null) {
      next = next.firstChild;

      if (next.routeConfig === null) { continue; }
      if (!next.routeConfig.path) { continue; }

      url += `/${this.createUrl(next)}`;
    }

    url += `/${this.createUrl(route)}`;

    return url;
  }

  ngOnInit() {
  }

}
