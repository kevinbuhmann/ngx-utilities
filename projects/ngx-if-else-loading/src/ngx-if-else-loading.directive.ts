import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  Optional,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';

import { NgxIfElseLoadingDefaultLoadingSpinnerComponent } from './ngx-if-else-loading-default-loading-spinner/ngx-if-else-loading-default-loading-spinner.component';
import { NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT } from './ngx-if-else-loading.di-tokens';

class NgxIfElseLoadingContext {
  $implicit: any;
}

export interface LoadingComponent {
  message: string;
}

@Directive({
  selector: '[ngxIfElseLoading]'
})
export class NgxIfElseLoadingDirective {
  private message: string;
  private viewRef: EmbeddedViewRef<NgxIfElseLoadingContext>;
  private loadingComponentRef: ComponentRef<LoadingComponent>;

  @Input()
  set ngxIfElseLoading(value: any) {
    this.updateView(value);
  }

  @Input()
  set ngxIfElseLoadingWithMessage(message: any) {
    this.message = message;
    this.setLoadingComponentMessage();
  }

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly templateRef: TemplateRef<NgxIfElseLoadingContext>,
    private readonly viewContainerRef: ViewContainerRef,
    @Optional()
    @Inject(NGX_IF_ELSE_LOADING_CUSTOM_LOADING_COMPONENT)
    private readonly ngxIfElseLoadingCustomLoadingComponent?: Type<LoadingComponent>
  ) {}

  private updateView(value: any) {
    if (value && this.viewRef) {
      this.viewRef.context.$implicit = value;
      this.viewRef.detectChanges();
    } else if (value && !this.viewRef) {
      const context = new NgxIfElseLoadingContext();
      context.$implicit = value;

      this.clear();
      this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, context);
      this.viewRef.detectChanges();
    } else if (!value && !this.loadingComponentRef) {
      const loadingComponent = this.ngxIfElseLoadingCustomLoadingComponent || NgxIfElseLoadingDefaultLoadingSpinnerComponent;
      const loadingComponentFactory = this.componentFactoryResolver.resolveComponentFactory(loadingComponent);

      this.clear();
      this.loadingComponentRef = this.viewContainerRef.createComponent(loadingComponentFactory);
      this.setLoadingComponentMessage();
    }
  }

  private setLoadingComponentMessage() {
    if (this.loadingComponentRef) {
      this.loadingComponentRef.instance.message = this.message || 'Loading...';
      this.loadingComponentRef.changeDetectorRef.detectChanges();
    }
  }

  private clear() {
    this.viewRef = undefined;
    this.loadingComponentRef = undefined;

    this.viewContainerRef.clear();
  }
}
