import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';
import * as Prism from 'prismjs';

@Pipe({
  name: 'appMarkdownToHtml'
})
export class MarkdownToHtmlPipe implements PipeTransform {
  transform(value: string) {
    return marked(value, {
      gfm: true,
      breaks: true,
      headerIds: false,
      tables: true,
      highlight: (code, language) => {
        switch (language) {
          case 'typescript':
            return Prism.highlight(code, Prism.languages['javascript']);
          case 'html':
            return Prism.highlight(code, Prism.languages['markup']);
          default:
            return code;
        }
      }
    });
  }
}
