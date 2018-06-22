import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

export function listAnimation (){
    return trigger('listAnimation', [
        transition('* => *', [
  
          query(':enter', style({ opacity: 0 }), { optional: true }),
  
          query(':enter', stagger('100ms', [
            animate('0.2s ease-in', keyframes([
              style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
              style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
              style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
            ]))]), { optional: true }),
  
          query(':leave', stagger('100ms', [
            animate('0.2s ease-in', keyframes([
              style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
              style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
              style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
            ]))]), { optional: true })
        ])
      ])
}