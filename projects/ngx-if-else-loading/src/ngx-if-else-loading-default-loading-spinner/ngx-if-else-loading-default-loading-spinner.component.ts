import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-if-else-loading-default-loading-spinner',
  templateUrl: './ngx-if-else-loading-default-loading-spinner.component.html',
  styleUrls: ['./ngx-if-else-loading-default-loading-spinner.component.scss']
})
export class NgxIfElseLoadingDefaultLoadingSpinnerComponent {
  @Input() message: string;
}
