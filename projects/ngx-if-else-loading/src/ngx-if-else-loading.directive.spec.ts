import { Component, NgModule, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgxIfElseLoadingDefaultLoadingSpinnerComponent } from './ngx-if-else-loading-default-loading-spinner/ngx-if-else-loading-default-loading-spinner.component';
import { LoadingComponent } from './ngx-if-else-loading.directive';
import { NgxIfElseLoadingModule } from './ngx-if-else-loading.module';

@Component({
  selector: 'app-ngx-if-else-loading-host',
  template: `
    <ng-container *ngxIfElseLoading="value; withMessage: loadingMessage">
      <div class="content">{{ value | json }}</div>
    </ng-container>
  `
})
class NgxIfElseLoadingHostComponent {
  value: string[];
  loadingMessage: string;
}

@Component({
  selector: 'app-custom-loading-spinner',
  template: '{{message}}'
})
class CustomLoadingSpinnerComponent {
  message: string;
}

@NgModule({
  declarations: [CustomLoadingSpinnerComponent],
  exports: [CustomLoadingSpinnerComponent],
  entryComponents: [CustomLoadingSpinnerComponent]
})
class CustomLoadingSpinnerModule {}

describe('NgxIfElseLoadingDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxIfElseLoadingModule],
      declarations: [NgxIfElseLoadingHostComponent]
    });
  });

  runTests(NgxIfElseLoadingDefaultLoadingSpinnerComponent);
});

describe('NgxIfElseLoadingDirective with custom loading spinner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomLoadingSpinnerModule, NgxIfElseLoadingModule.withCustomLoadingComponent(CustomLoadingSpinnerComponent)],
      declarations: [NgxIfElseLoadingHostComponent]
    });
  });

  runTests(CustomLoadingSpinnerComponent);
});

function runTests(loadingComponent: Type<LoadingComponent>) {
  let fixture: ComponentFixture<NgxIfElseLoadingHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxIfElseLoadingHostComponent);
    nativeElement = fixture.nativeElement;
  });

  it('should show the loading component the value is falsy', () => {
    fixture.componentInstance.value = undefined;
    fixture.detectChanges();

    expect(nativeElement.textContent).toBe('Loading...');
    expect(fixture.debugElement.query(By.directive(loadingComponent))).toBeTruthy();
  });

  it('should show custom loading messages', () => {
    fixture.componentInstance.value = undefined;
    fixture.componentInstance.loadingMessage = 'Loading items...';
    fixture.detectChanges();

    expect(nativeElement.textContent).toBe('Loading items...');
    expect(fixture.debugElement.query(By.directive(loadingComponent))).toBeTruthy();
  });

  it('should show the content the value is truthy', () => {
    const value = ['item 1', 'item 2'];
    fixture.componentInstance.value = value;
    fixture.detectChanges();

    expect(JSON.parse(nativeElement.textContent)).toEqual(value);
    expect(fixture.debugElement.query(By.directive(loadingComponent))).toBeNull();
  });

  it('should update the content when the value changes', () => {
    const firstValue = ['item 1', 'item 2'];
    fixture.componentInstance.value = firstValue;
    fixture.detectChanges();

    expect(JSON.parse(nativeElement.textContent)).toEqual(firstValue);

    const secondValue = ['item 1', 'item 2', 'item 3'];
    fixture.componentInstance.value = secondValue;
    fixture.detectChanges();

    expect(JSON.parse(nativeElement.textContent)).toEqual(secondValue);
  });

  it('should not re-instantiate the template after the value changes', () => {
    fixture.componentInstance.value = ['item 1', 'item 2'];
    fixture.detectChanges();

    const contentElementBeforeValueUpdate = nativeElement.querySelector('.content');
    expect(contentElementBeforeValueUpdate).toBeTruthy();

    fixture.componentInstance.value = ['item 1', 'item 2', 'item 3'];
    fixture.detectChanges();

    const contentElementAfterValueUpdate = nativeElement.querySelector('.content');
    expect(contentElementAfterValueUpdate).toBe(contentElementBeforeValueUpdate);
  });

  it('should re-instantiate the template when content is reloaded', () => {
    fixture.componentInstance.value = ['item 1', 'item 2'];
    fixture.detectChanges();

    const contentElementBeforeValueUpdate = nativeElement.querySelector('.content');
    expect(contentElementBeforeValueUpdate).toBeTruthy();

    // show loader between value updates
    fixture.componentInstance.value = undefined;
    fixture.detectChanges();

    fixture.componentInstance.value = ['item 1', 'item 2', 'item 3'];
    fixture.detectChanges();

    const contentElementAfterValueUpdate = nativeElement.querySelector('.content');
    expect(contentElementAfterValueUpdate).not.toBe(contentElementBeforeValueUpdate);
  });
}
