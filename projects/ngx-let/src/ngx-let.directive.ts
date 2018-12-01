import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

class NgxLetContext {
  $implicit: any = null;
}

@Directive({
  selector: '[ngxLet]'
})
export class NgxLetDirective implements OnInit {
  private context = new NgxLetContext();

  @Input()
  set ngxLet(value: any) {
    this.context.$implicit = value;
  }

  constructor(private readonly templateRef: TemplateRef<NgxLetContext>, private readonly viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
  }
}
