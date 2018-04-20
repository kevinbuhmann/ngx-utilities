import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

const Prism = require('prismjs');

@Component({
  selector: 'app-code',
  templateUrl: './code-highlight.component.html',
  styleUrls: ['./code-hightlight.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: true
})
export class CodeHighlightComponent implements OnInit {
  @Input() language = 'html';

  @ViewChild('content') contentElementRef: ElementRef;

  highlightedHtml = '';

  ngOnInit() {
    // replace with < and > to render HTML in angular
    const html = this.contentElementRef.nativeElement.innerHTML
      .replace(/\{ \{/gi, '{{')
      .replace(/\} \}/gi, '}}')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>');

    console.info(this.contentElementRef.nativeElement.innerHTML);

    if (this.language === 'javascript') {
      this.highlightedHtml = Prism.highlight(html, Prism.languages.javascript);
    } else {
      this.highlightedHtml = Prism.highlight(html, Prism.languages.markup);
    }
  }
}
