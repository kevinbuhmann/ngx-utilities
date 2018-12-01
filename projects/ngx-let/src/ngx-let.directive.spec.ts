import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLetModule } from './ngx-let.module';

@Component({
  selector: 'app-ngx-let-host',
  template: '<ng-container *ngxLet="value">{{value}}</ng-container>'
})
class NgxLetHostComponent {
  value: boolean;
}

describe('NgxLetDirective', () => {
  let fixture: ComponentFixture<NgxLetHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxLetModule],
      declarations: [NgxLetHostComponent]
    });

    fixture = TestBed.createComponent(NgxLetHostComponent);
    nativeElement = fixture.nativeElement;
  });

  it('should work for truthy values', () => {
    fixture.componentInstance.value = true;
    fixture.detectChanges();

    expect(nativeElement.textContent).toBe('true');
  });

  it('should work for falsy values', () => {
    fixture.componentInstance.value = false;
    fixture.detectChanges();

    expect(nativeElement.textContent).toBe('false');
  });
});
