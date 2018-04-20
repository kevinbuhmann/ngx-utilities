import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-github-corner',
  templateUrl: './ngx-github-corner.component.html',
  styleUrls: ['./ngx-github-corner.component.scss']
})
export class NgxGithubCornerComponent {
  @Input() url: string;
  @Input() fill: string;
  @Input() color: string;
}
