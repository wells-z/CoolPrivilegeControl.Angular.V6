import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
// import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store';
import { Observable } from 'rxjs';

import { MenuItem } from "../../../models/common/menu-item";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  animations: [
    trigger('subMenuState', [
      state('*', style({ display: 'none', opacity: 0 })),
      state('false', style({ display: 'none', opacity: 0 })),
      state('true', style({ opacity: 1, display: 'block' })),
      transition('* => true', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(300, style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition('* => false', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate(300, style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SideMenuComponent implements OnInit {

  @Input() openMenu: boolean = false;

  @Output() MenuItemClick = new EventEmitter<any>();

  @Input() menuItem: MenuItem;

  expanded: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  menuItemClick(event: MouseEvent) {
    let selNode: any;
    if (event instanceof MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
      selNode = this.menuItem
    } else {
      selNode = event
    }

    if (selNode.SubMenuItems == null) {
      this.MenuItemClick.emit(selNode);
    }
    else {
      this.toggle();
    }
  }

}
